import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner } from "react-bootstrap";
import { videoService } from "../services/videoService";

const VideoController = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [series, setSeries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedType, setSelectedType] = useState("all"); // "all", "series", "single"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [seriesData, videosData] = await Promise.all([
        videoService.getAllSeries(),
        videoService.getAllVideos()
      ]);
      
      setSeries(seriesData);
      setVideos(videosData);
      setFilteredVideos(videosData);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (child) => {
    setSelectedChild(child);
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

    console.log("Selected Child:", selectedChild);
    console.log("Selected Videos:", selectedVideos);
    
    // Here you would typically send this data to your backend
    alert("Data saved successfully!");
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

  // Handle single video click
  const handleSingleVideoClick = async (videoId) => {
    try {
      setLoading(true);
      const videoData = await videoService.getVideoById(videoId);
      console.log("Single video data:", videoData);
      
      // You can do something with the single video data here
      // For example, play the video or show details
      alert(`Video clicked: ${videoData.title || 'Video'}`);
      
    } catch (err) {
      setError("Failed to fetch video details.");
      console.error("Error fetching video:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading videos...</p>
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
            {selectedChild || "Select Child"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="Ali">Ali</Dropdown.Item>
            <Dropdown.Item eventKey="Sara">Sara</Dropdown.Item>
            <Dropdown.Item eventKey="Ahmed">Ahmed</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVideos.length > 0 ? (
            filteredVideos.map((item) => (
              <tr key={item.id}>
                <td>
                  <Form.Check
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={() => handleCheckboxChange(item.id)}
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
                <td>
                  {/* Dropdown for single video actions */}
                  <Dropdown>
                    <Dropdown.Toggle 
                      variant="outline-primary" 
                      size="sm"
                      id={`dropdown-${item.id}`}
                    >
                      Actions
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item 
                        onClick={() => handleSingleVideoClick(item.id)}
                      >
                        Play Video
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={() => console.log("View details:", item)}
                      >
                        View Details
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        onClick={() => console.log("Add to favorites:", item)}
                      >
                        Add to Favorites
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No videos found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Save Button */}
      <div className="text-end mt-3">
        <Button variant="success" onClick={handleSave}>
          Save Selections
        </Button>
        <Button 
          variant="outline-secondary" 
          className="ms-2"
          onClick={fetchData}
        >
          Refresh Data
        </Button>
      </div>
    </div>
  );
};

export default VideoController;