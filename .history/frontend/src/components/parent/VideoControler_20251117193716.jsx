import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner } from "react-bootstrap";


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
    console.log("User data from localStorage:", userData);
    setParentId(userData.id || userData.parentId || "");
  }, []);

  // Fetch children when parentId is available
  useEffect(() => {
    if (parentId) {
      console.log("Fetching children for parentId:", parentId);
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
      console.log("Calling getChildrenByParentIdApi with parentId:", parentId);
      const response = await getChildrenByParentIdApi(parentId);
      console.log("Full children response:", response);
      
      // Extract the children array from the response
      // Based on your console log, the structure is: {data: Array(1), message: "...", total_children: 1}
      const childrenData = response.data || [];
      console.log("Children data to set:", childrenData);
      
      setChildren(childrenData);
    } catch (err) {
      console.error("Error fetching children:", err);
      setError("Failed to fetch children. Please try again.");
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
      
      console.log("Series response:", seriesResponse);
      console.log("Videos response:", videosResponse);
      
      // Handle different response structures
      const seriesData = seriesResponse?.data || seriesResponse || [];
      const videosData = videosResponse?.data || videosResponse || [];
      
      // Ensure we have arrays and add unique IDs if needed
      const seriesWithIds = Array.isArray(seriesData) ? seriesData.map((item, index) => ({
        ...item,
        id: item.id || `series-${index}`,
        type: 'series'
      })) : [];
      
      const videosWithIds = Array.isArray(videosData) ? videosData.map((item, index) => ({
        ...item,
        id: item.id || `video-${index}`,
        type: 'single'
      })) : [];
      
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
    console.log("Selected child ID:", childId);
    const selected = children.find(child => child.id == childId);
    console.log("Found child:", selected);
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
    
    alert(`Videos saved successfully for ${selectedChild.name}!`);
  };

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

  const handleRowClick = async (item) => {
    if (!selectedChild) {
      alert("Please select a child first!");
      return;
    }

    if (item.type === 'single') {
      try {
        setLoading(true);
        const videoData = await videoService.getVideoById(item.id);
        alert(`Video "${videoData.title || item.title || 'Video'}" selected for ${selectedChild.name}`);
      } catch (err) {
        setError("Failed to fetch video details.");
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    } else {
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
            {children && children.length > 0 ? (
              children.map((child) => (
                <Dropdown.Item 
                  key={`child-${child.id}`}
                  eventKey={child.id}
                >
                  {child.name} (ID: {child.id})
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>
                {childrenLoading ? "Loading..." : "No children found"}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        
        <div className="mt-2">
          <small className="text-muted">
            {children && children.length > 0 
              ? `${children.length} child(ren) found` 
              : "No children available"}
          </small>
        </div>
        
        {/* Debug info - remove in production */}
        <div className="mt-2">
          <small className="text-info">
            Debug: Parent ID: {parentId}, Children count: {children?.length || 0}
          </small>
        </div>
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
                key={`${item.type}-${item.id}`}
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
        <Button 
          variant="outline-info" 
          className="ms-2"
          onClick={fetchChildren}
        >
          Refresh Children
        </Button>
      </div>
    </div>
  );
};

export default VideoController;