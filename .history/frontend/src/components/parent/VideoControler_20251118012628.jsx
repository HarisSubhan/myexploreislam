import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner, Modal } from "react-bootstrap";
import { getChildrenByParentIdApi, assignContentToChildApi } from "../../services/parentApi";
import { videoService } from "../../services/VideoController";

const VideoController = () => {
  const [selectedChild, setSelectedChild] = useState("");
  const [children, setChildren] = useState([]);
  const [series, setSeries] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const parentId = userData.id || userData.parentId || "";
    
    if (parentId) {
      fetchChildren(parentId);
    }
    
    fetchVideosAndSeries();
  }, []);

  const fetchChildren = async (parentId) => {
    try {
      const response = await getChildrenByParentIdApi(parentId);
      setChildren(response.data || []);
    } catch (err) {
      setError("Failed to fetch children");
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
          type,
          checked: false
        }));

      const seriesData = processData(seriesResponse, 'series');
      const videosData = processData(videosResponse, 'single');

      setSeries(seriesData);
      setVideos(videosData);
      setFilteredVideos([...seriesData, ...videosData]);
    } catch (err) {
      setError("Failed to fetch content");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChild = (childId) => {
    const selected = children.find(child => child.id == childId);
    setSelectedChild(selected ? { id: childId, name: selected.name } : "");
    setError("");
  };

  const handleCheckboxChange = (id) => {
    setFilteredVideos(prev =>
      prev.map(v => (v.id === id ? { ...v, checked: !v.checked } : v))
    );
  };

  const handleSave = () => {
    const selectedVideos = filteredVideos.filter(v => v.checked);
    
    if (!selectedChild) {
      setError("Please select a child first");
      return;
    }

    if (selectedVideos.length === 0) {
      setError("Please select at least one video or series");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setSaving(true);
    setError("");
    
    try {
      const selectedItems = filteredVideos.filter(v => v.checked);
      
      const assignmentPromises = selectedItems.map(async (item) => {
        const assignData = {
          child_id: parseInt(selectedChild.id),
          video_id: item.type === 'single' ? parseInt(item.id) : null,
          series_id: item.type === 'series' ? parseInt(item.id) : null
        };

        return await assignContentToChildApi(assignData);
      });

      await Promise.all(assignmentPromises);
      
      setSuccess(`Assigned ${selectedItems.length} items to ${selectedChild.name}`);
      
      setFilteredVideos(prev => 
        prev.map(v => ({ ...v, checked: false }))
      );
      
      setShowConfirmModal(false);
      
    } catch (err) {
      setError("Failed to assign content");
    } finally {
      setSaving(false);
    }
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

  const clearSelections = () => {
    setFilteredVideos(prev => 
      prev.map(v => ({ ...v, checked: false }))
    );
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  const selectedVideosCount = filteredVideos.filter(v => v.checked).length;

  return (
    <div className="container mt-4">
      <h3>Video Controller</h3>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {/* Child Selection */}
      <div className="mb-3">
        <label>Select Child:</label>
        <Dropdown onSelect={handleSelectChild}>
          <Dropdown.Toggle variant="primary">
            {selectedChild ? selectedChild.name : "Select Child"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {children.map((child) => (
              <Dropdown.Item key={child.id} eventKey={child.id}>
                {child.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Content Type Filter */}
      <div className="mb-3">
        <label>Content Type:</label>
        <div>
          {["all", "series", "single"].map(type => (
            <Form.Check
              key={type}
              inline
              type="radio"
              label={type === "all" ? "All" : type === "series" ? "Series" : "Single"}
              name="contentType"
              checked={selectedType === type}
              onChange={() => handleTypeChange(type)}
            />
          ))}
        </div>
      </div>

      {/* Videos Table */}
      <Table bordered hover>
        <thead>
          <tr>
            <th>Select</th>
            <th>Type</th>
            <th>Title</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredVideos.map((item) => (
            <tr key={`${item.type}-${item.id}`}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={item.checked || false}
                  onChange={() => handleCheckboxChange(item.id)}
                  disabled={!selectedChild}
                />
              </td>
              <td>
                <span className={`badge ${item.type === 'series' ? 'bg-warning' : 'bg-info'}`}>
                  {item.type}
                </span>
              </td>
              <td>{item.title || item.name || item.video}</td>
              <td>{item.id}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Actions */}
      <div className="mt-3">
        <Button 
          variant="success" 
          onClick={handleSave}
          disabled={!selectedChild || selectedVideosCount === 0 || saving}
        >
          {saving ? "Saving..." : `Save ${selectedVideosCount} Selection(s)`}
        </Button>
        <Button 
          variant="outline-secondary" 
          className="ms-2"
          onClick={clearSelections}
        >
          Clear
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Assign {selectedVideosCount} items to {selectedChild?.name}?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSave} disabled={saving}>
            {saving ? "Assigning..." : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoController;