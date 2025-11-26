import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner } from "react-bootstrap";


const VideoController = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [children, setChildren] = useState([]); // Store children list
  const [series, setSeries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [error, setError] = useState("");
  const [parentId, setParentId] = useState(""); // You need to get this from your auth context or props

  // Fetch parent ID from your authentication context or localStorage
  useEffect(() => {
    // Example: Get parent ID from localStorage or context
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setParentId(userData.id || userData.parentId || "");
  }, []);

  // Fetch children when parentId is available
  useEffect(() => {
    if (parentId) {
      fetchChildren();
    }
  }, [parentId]);

  // Fetch data on component mount
  useEffect(() => {
    fetchVideosAndSeries();
  }, []);

  const fetchChildren = async () => {
    setChildrenLoading(true);
    setError("");
    try {
      const childrenData = await getChildrenByParentIdApi(parentId);
      setChildren(childrenData || []);
    } catch (err) {
      setError("Failed to fetch children. Please try again.");
      console.error("Error fetching children:", err);
    } finally {
      setChildrenLoading(false);
    }
  };

  const fetchVideosAndSeries = async () => {
    setLoading(true);
    setError("");
    try {
      const [seriesData, videosData] = await Promise.all([
        videoService.getAllSeries(),
        videoService.getAllVideos()
      ]);
      
      setSeries(seriesData || []);
      setVideos(videosData || []);
      setFilteredVideos([...seriesData, ...videosData]);
    } catch (err) {
      setError("Failed to fetch videos and series. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId) => {
    const selected = children.find(child => child.id === childId);
    setSelectedChild(selected ? { id: childId, name: selected.name } : "");
  };

  const handleCheckboxChange = (id) => {
    setFilteredVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const handleSave = () => {
    const selectedVideos = filteredVideos.filter((v) => v.checked);
    
    if (!selectedChild) {
      alert("Please select a child first!");
      return;
    }

    if (selectedVideos.length === 0) {
      alert("Please select at least one video or series!");
      return;
    }

    console.log("Selected Child:", selectedChild);
    console.log("Selected Videos:", selectedVideos);
    
    // Here you would typically send this data to your backend
    // Example: saveSelectedVideosForChild(selectedChild.id, selectedVideos);
    
    alert(`Videos saved successfully for ${selectedChild.name}!`);
  };

  // Filter videos based on selection type
  const handleTypeChange = (type) => {
    setSelectedType(type);
    
    if (type === "series") {
      setFilteredVideos(series);
    } else if (type === "single") {
      setFilteredVideos(videos);
    } else {
      setFilteredVideos([...series, ...videos]);
    }
  };

  // Handle row click for single video
  const handleRowClick = async (item) => {
    if (!selectedChild) {
      alert("Please select a child first!");
      return;
    }

    // If it's a single video, call the single video API
    if (videos.some(v => v.id === item.id)) {
      try {
        setLoading(true);
        const videoData = await videoService.getVideoById(item.id);
        console.log("Single video data:", videoData);
        
        // You can do something with the single video data here
        alert(`Video "${videoData.title || item.title || 'Video'}" selected for ${selectedChild.name}`);
        
      } catch (err) {
        setError("Failed to fetch video details.");
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // If it's a series, handle series click
      console.log("Series clicked:", item);
      alert(`Series "${item.title || item.name || 'Series'}" selected for ${selectedChild.name}`);
    }
  };

  if (loading || childrenLoading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading content...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Video Controller</h3>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Child Dropdown */}
      <div className="mb-4">
        <label className="form-label">Select Child:</label>
        <Dropdown onSelect={handleSelectChild}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedChild ? selectedChild.name : "Select Child"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {children.length > 0 ? (
              children.map((child) => (
                <Dropdown.Item 
                  key={child.id} 
                  eventKey={child.id}
                  disabled={!child.is_active} // Optional: disable inactive children
                >
                  {child.name} {!child.is_active && "(Inactive)"}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No children found</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        
        {children.length === 0 && !childrenLoading && (
          <div className="text-muted mt-1">
            No children found. Please add children first.
          </div>
        )}
      </div>

      {/* Video Type Selection */}
      <div className="mb-4">
        <label className="form-label">Content Type:</label>
        <div>
          <Form.Check
            inline
            type="radio"
            label="All"
            name="contentType"
            checked={selectedType === "all"}
            onChange={() => handleTypeChange("all")}
          />
          <Form.Check
            inline
            type="radio"
            label="Series Only"
            name="contentType"
            checked={selectedType === "series"}
            onChange={() => handleTypeChange("series")}
          />
          <Form.Check
            inline
            type="radio"
            label="Single Videos Only"
            name="contentType"
            checked={selectedType === "single"}
            onChange={() => handleTypeChange("single")}
          />
        </div>
      </div>

      {/* Video Table */}
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "60px" }}>Select</th>
            <th>Type</th>
            <th>Title</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((item) => (
              <tr 
                key={item.id} 
                onClick={() => handleRowClick(item)}
                style={{ cursor: 'pointer' }}
                className="table-row-hover"
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <Form.Check
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={() => handleCheckboxChange(item.id)}
                    disabled={!selectedChild} // Disable if no child selected
                  />
                </td>
                <td>
                  <span className={`badge ${
                    series.some(s => s.id === item.id) ? 'bg-warning' : 'bg-info'
                  }`}>
                    {series.some(s => s.id === item.id) ? 'Series' : 'Single'}
                  </span>
                </td>
                <td>{item.title || item.name || item.video}</td>
                <td>{item.age || item.recommendedAge || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No videos found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Save Button */}
      <div className="text-end mt-3">
        <Button 
          variant="success" 
          onClick={handleSave}
          disabled={!selectedChild || filteredVideos.filter(v => v.checked).length === 0}
        >
          Save Selections for {selectedChild ? selectedChild.name : 'Child'}
        </Button>
        <Button 
          variant="outline-secondary" 
          className="ms-2"
          onClick={fetchVideosAndSeries}
        >
          Refresh Content
        </Button>
      </div>
    </div>
  );
};

export default VideoController;