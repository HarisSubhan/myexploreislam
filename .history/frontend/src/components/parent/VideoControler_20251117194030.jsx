import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner } from "react-bootstrap";
import { getChildrenByParentIdApi } from "../../services/parentApi";
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

  // Get parent ID and fetch data
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const parentId = userData.id || userData.parentId || "";
    
    if (parentId) {
      fetchChildren(parentId);
    }
    
    fetchVideosAndSeries();
  }, []);

  const fetchChildren = async (parentId) => {
    setChildrenLoading(true);
    try {
      const response = await getChildrenByParentIdApi(parentId);
      setChildren(response.data || []);
    } catch (err) {
      setError("Failed to fetch children. Please try again.");
    } finally {
      setChildrenLoading(false);
    }
  };

  const fetchVideosAndSeries = async () => {
    setLoading(true);
    try {
      const [seriesResponse, videosResponse] = await Promise.all([
        videoService.getAllSeries(),
        videoService.getAllVideos()
      ]);
      
      const processData = (data, type) => 
        (data?.data || data || []).map((item, index) => ({
          ...item,
          id: item.id || `${type}-${index}`,
          type
        }));

      const seriesData = processData(seriesResponse, 'series');
      const videosData = processData(videosResponse, 'single');

      setSeries(seriesData);
      setVideos(videosData);
      setFilteredVideos([...seriesData, ...videosData]);
    } catch (err) {
      setError("Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId) => {
    const selected = children.find(child => child.id == childId);
    setSelectedChild(selected ? { id: childId, name: selected.name } : "");
  };

  const handleCheckboxChange = (id) => {
    setFilteredVideos(prev =>
      prev.map(v => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const handleSave = () => {
    const selectedVideos = filteredVideos.filter(v => v.checked);
    
    if (!selectedChild) {
      alert("Please select a child first!");
      return;
    }

    if (selectedVideos.length === 0) {
      alert("Please select at least one video or series!");
      return;
    }

    // Save logic here
    alert(`Videos saved successfully for ${selectedChild.name}!`);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setFilteredVideos(
      type === "series" ? series :
      type === "single" ? videos :
      [...series, ...videos]
    );
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
        <Spinner animation="border" />
        <p className="mt-2">Loading content...</p>
      </div>
    );
  }

  const selectedVideosCount = filteredVideos.filter(v => v.checked).length;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Video Controller</h3>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Child Selection */}
      <div className="mb-4">
        <label className="form-label">Select Child:</label>
        <Dropdown onSelect={handleSelectChild}>
          <Dropdown.Toggle variant="primary">
            {selectedChild ? selectedChild.name : "Select Child"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {children.length > 0 ? (
              children.map((child) => (
                <Dropdown.Item key={child.id} eventKey={child.id}>
                  {child.name}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>
                {childrenLoading ? "Loading..." : "No children found"}
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
        {children.length === 0 && !childrenLoading && (
          <div className="text-muted mt-1">No children available</div>
        )}
      </div>

      {/* Content Type Filter */}
      <div className="mb-4">
        <label className="form-label">Content Type:</label>
        <div>
          {["all", "series", "single"].map(type => (
            <Form.Check
              key={type}
              inline
              type="radio"
              label={type === "all" ? "All" : type === "series" ? "Series Only" : "Single Videos Only"}
              name="contentType"
              checked={selectedType === type}
              onChange={() => handleTypeChange(type)}
            />
          ))}
        </div>
      </div>

      {/* Videos Table */}
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
                  <span className={`badge ${item.type === 'series' ? 'bg-warning' : 'bg-info'}`}>
                    {item.type === 'series' ? 'Series' : 'Single'}
                  </span>
                </td>
                <td>{item.title || item.name || item.video}</td>
                <td>{item.age || item.recommendedAge || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No content found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Actions */}
      <div className="text-end mt-3">
        <Button 
          variant="success" 
          onClick={handleSave}
          disabled={!selectedChild || selectedVideosCount === 0}
        >
          Save {selectedVideosCount} Selection(s) for {selectedChild ? selectedChild.name : 'Child'}
        </Button>
        <Button 
          variant="outline-secondary" 
          className="ms-2"
          onClick={fetchVideosAndSeries}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default VideoController;