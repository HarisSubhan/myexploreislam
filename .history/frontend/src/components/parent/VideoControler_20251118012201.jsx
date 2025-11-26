import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner, Modal, Card } from "react-bootstrap";
import { getChildrenByParentIdApi, assignContentToChildApi, checkServerHealth } from "../../services/parentApi";
import { videoService } from "../../services/VideoController";

const VideoController = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [children, setChildren] = useState([]);
  const [series, setSeries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [serverOnline, setServerOnline] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    checkAuthentication();
    checkServerConnection();
    
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const parentId = userData.id || userData.parentId || "";
    
    if (parentId && serverOnline && isAuthenticated) {
      fetchChildren(parentId);
    }
    
    if (serverOnline && isAuthenticated) {
      fetchVideosAndSeries();
    }
  }, [serverOnline, isAuthenticated]);

  const checkAuthentication = () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const token = userData.token || userData.accessToken;
    
    if (!token) {
      setIsAuthenticated(false);
      setError("Please login to access this feature.");
    } else {
      setIsAuthenticated(true);
    }
  };

  const checkServerConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:5000', {
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      setServerOnline(true);
    } catch (err) {
      console.error('Server connection check failed:', err);
      setServerOnline(false);
      setError("Backend server is not running. Please start the server and refresh the page.");
    }
  };

  const fetchChildren = async (parentId) => {
    setChildrenLoading(true);
    setError("");
    try {
      const response = await getChildrenByParentIdApi(parentId);
      setChildren(response.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch children. Please try again.");
      }
      console.error("Error fetching children:", err);
    } finally {
      setChildrenLoading(false);
    }
  };

  const fetchVideosAndSeries = async () => {
    setLoading(true);
    setError("");
    try {
      const [seriesResponse, videosResponse] = await Promise.all([
        videoService.getAllSeries(),
        videoService.getAllVideos()
      ]);
      
      const processData = (data, type) => 
        (data?.data || data || []).map((item, index) => ({
          ...item,
          id: item.id || `${type}-${index}`,
          type,
          checked: false
        }));

      const seriesData = processData(seriesResponse, 'series');
      const videosData = processData(videosResponse, 'single');

      setSeries(seriesData);
      setVideos(videosData);
      setFilteredVideos([...seriesData, ...videosData]);
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
      } else {
        setError("Failed to fetch content. Please try again.");
      }
      console.error("Error fetching content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId) => {
    const selected = children.find(child => child.id == childId);
    setSelectedChild(selected ? { id: childId, name: selected.name } : "");
    setError("");
    setSuccess("");
  };

  const handleCheckboxChange = (id) => {
    setFilteredVideos(prev =>
      prev.map(v => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const handleSelectAll = (checked) => {
    setFilteredVideos(prev =>
      prev.map(v => ({ ...v, checked: checked }))
    );
  };

  const handleSave = () => {
    if (!serverOnline) {
      setError("Server is offline. Please start the backend server and try again.");
      return;
    }

    if (!isAuthenticated) {
      setError("Please login to assign content.");
      return;
    }

    const selectedVideos = filteredVideos.filter(v => v.checked);
    
    if (!selectedChild) {
      setError("Please select a child first!");
      return;
    }

    if (selectedVideos.length === 0) {
      setError("Please select at least one video or series!");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const selectedItems = filteredVideos.filter(v => v.checked);
      
      // Check authentication before proceeding
      checkAuthentication();
      if (!isAuthenticated) {
        throw new Error("Authentication required. Please login again.");
      }

      // Send individual requests for each selected item
      const assignmentPromises = selectedItems.map(async (item) => {
        const assignData = {
          child_id: parseInt(selectedChild.id),
          video_id: item.type === 'single' ? parseInt(item.id) : null,
          series_id: item.type === 'series' ? parseInt(item.id) : null
        };

        console.log('Sending assignment data:', assignData);
        return await assignContentToChildApi(assignData);
      });

      // Wait for all assignments to complete
      const results = await Promise.all(assignmentPromises);
      
      setSuccess(`Successfully assigned ${selectedItems.length} item(s) to ${selectedChild.name}!`);
      
      // Clear selections
      setFilteredVideos(prev => 
        prev.map(v => ({ ...v, checked: false }))
      );
      
      setShowConfirmModal(false);
      
    } catch (err) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        setError("Session expired. Please login again.");
      } else {
        const errorMessage = err.message || "Failed to assign content. Please try again.";
        setError(errorMessage);
      }
      console.error("Error assigning content:", err);
    } finally {
      setSaving(false);
    }
  };

  // ... other functions remain similar but add auth checks ...

  const handleLoginRedirect = () => {
    // Redirect to login page or show login modal
    window.location.href = '/login'; // Adjust based on your routing
  };

  if (!isAuthenticated) {
    return (
      <div className="container mt-4">
        <Alert variant="warning">
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill"></i> Authentication Required
          </Alert.Heading>
          <p>
            You need to be logged in to access the video controller.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={handleLoginRedirect} variant="primary">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!serverOnline) {
    return (
      <div className="container mt-4">
        <Alert variant="danger">
          <Alert.Heading>
            <i className="bi bi-wifi-off"></i> Connection Error
          </Alert.Heading>
          <p>
            Cannot connect to the backend server. Please ensure:
          </p>
          <ul>
            <li>The backend server is running on <code>http://localhost:5000</code></li>
            <li>There are no firewall restrictions blocking the connection</li>
            <li>The server is not experiencing downtime</li>
          </ul>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={retryConnection} variant="outline-danger">
              <i className="bi bi-arrow-clockwise"></i> Retry Connection
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // ... rest of the component JSX remains similar but with auth status indicator ...

  return (
    <div className="container mt-4">
      {/* Connection and Auth Status Indicator */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Video Controller</h3>
        <div className="d-flex align-items-center gap-2">
          <div className={`badge ${isAuthenticated ? 'bg-success' : 'bg-warning'}`}>
            <i className={`bi ${isAuthenticated ? 'bi-shield-check' : 'bi-shield-exclamation'}`}></i>
            {isAuthenticated ? ' Authenticated' : ' Not Authenticated'}
          </div>
          <div className={`badge ${serverOnline ? 'bg-success' : 'bg-danger'}`}>
            <i className={`bi ${serverOnline ? 'bi-wifi' : 'bi-wifi-off'}`}></i>
            {serverOnline ? ' Online' : ' Offline'}
          </div>
          <Button 
            variant="outline-primary" 
            onClick={retryConnection}
            disabled={loading}
            size="sm"
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </Button>
        </div>
      </div>

      {/* ... rest of the JSX remains the same ... */}
    </div>
  );
};

export default VideoController;