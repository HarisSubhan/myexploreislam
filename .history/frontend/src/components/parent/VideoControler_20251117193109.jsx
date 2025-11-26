import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner } from "react-bootstrap";
import { getChildrenByParentIdApi } from "../../services/parentApi";


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
  const [parentId, setParentId] = useState("");

  // Get parent ID from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setParentId(userData.id || userData.parentId || "");
  }, []);

  // Fetch children when parentId is available
  useEffect(() => {
    if (parentId) {
      fetchChildren();
    }
  }, [parentId]);

  // Fetch videos and series data
  useEffect(() => {
    fetchVideosAndSeries();
  }, []);

  const fetchChildren = async () => {
    setChildrenLoading(true);
    setError("");
    try {
      const response = await getChildrenByParentIdApi(parentId);
      // Extract the children array from the response
      const childrenData = response.data || [];
      setChildren(childrenData);
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
      
      // Ensure we have arrays and add unique IDs if needed
      const seriesWithIds = (seriesData.data || seriesData || []).map((item, index) => ({
        ...item,
        id: item.id || `series-${index}`,
        type: 'series'
      }));
      
      const videosWithIds = (videosData.data || videosData || []).map((item, index) => ({
        ...item,
        id: item.id || `video-${index}`,
        type: 'single'
      }));
      
      setSeries(seriesWithIds);
      setVideos(videosWithIds);
      setFilteredVideos([...seriesWithIds, ...videosWithIds]);
    } catch (err) {
      setError("Failed to fetch videos and series. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId) => {
    const selected = children.find(child => child.id == childId); // Use == for string/number comparison
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

    if (item.type === 'single') {
      try {
        setLoading(true);
        const videoData = await videoService.getVideoById(item.id);
        console.log("Single video data:", videoData);
        alert(`Video "${videoData.title || item.title || 'Video'}" selected for ${selectedChild.name}`);
      } catch (err) {
        setError("Failed to fetch video details.");
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    } else {
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
                  key={`child-${child.id}`} // Unique key for each child
                  eventKey={child.id}
                >
                  {child.name}
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
                key={`${item.type}-${item.id}`} // Unique key combining type and id
                onClick={() => handleRowClick(item)}
                style={{ cursor: 'pointer' }}
                className="table-row-hover"
              >
                <td onClick={(e) => e.stopPropagation()}>
                  <Form.Check
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={() => handleCheckboxChange(item.id)}
                    disabled={!selectedChild}
                  />
                </td>
                <td>
                  <span className={`badge ${
                    item.type === 'series' ? 'bg-warning' : 'bg-info'
                  }`}>
                    {item.type === 'series' ? 'Series' : 'Single'}
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