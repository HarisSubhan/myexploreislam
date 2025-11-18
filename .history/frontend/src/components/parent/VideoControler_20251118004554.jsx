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
  const [childrenLoading, setChildrenLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // ... existing useEffect और fetch functions वही रहेंगे ...

  const handleSave = async () => {
    const selectedVideos = filteredVideos.filter(v => v.checked);
    
    if (!selectedChild) {
      alert("Please select a child first!");
      return;
    }

    if (selectedVideos.length === 0) {
      alert("Please select at least one video or series!");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const selectedVideos = filteredVideos.filter(v => v.checked);
      
      // Data prepare करें API के format में
      const assignData = {
        childId: selectedChild.id,
        content: selectedVideos.map(item => ({
          contentId: item.id,
          contentType: item.type === 'series' ? 'series' : 'video',
          title: item.title || item.name || item.video,
          age: item.age || item.recommendedAge || 'N/A'
        }))
      };

      // API call
      const response = await assignContentToChildApi(assignData);
      
      setSuccess(`Successfully assigned ${selectedVideos.length} item(s) to ${selectedChild.name}!`);
      
      // Selection clear करें
      setFilteredVideos(prev => 
        prev.map(v => ({ ...v, checked: false }))
      );
      
      setShowConfirmModal(false);
      
    } catch (err) {
      setError("Failed to assign content. Please try again.");
      console.error("Error assigning content:", err);
    } finally {
      setSaving(false);
    }
  };

  // ... existing functions वही रहेंगे ...

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Video Controller</h3>

      {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}

      {/* ... existing child selection और content type filter ... */}

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
                className={item.checked ? 'table-active' : ''}
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
          disabled={!selectedChild || selectedVideosCount === 0 || saving}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            `Save ${selectedVideosCount} Selection(s) for ${selectedChild ? selectedChild.name : 'Child'}`
          )}
        </Button>
        <Button 
          variant="outline-secondary" 
          className="ms-2"
          onClick={fetchVideosAndSeries}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Assignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to assign <strong>{selectedVideosCount} item(s)</strong> to <strong>{selectedChild?.name}</strong>?</p>
          <div className="mt-3">
            <h6>Selected Items:</h6>
            <ul>
              {filteredVideos.filter(v => v.checked).slice(0, 5).map(item => (
                <li key={item.id}>
                  {item.title || item.name} 
                  <span className={`badge ${item.type === 'series' ? 'bg-warning' : 'bg-info'} ms-2`}>
                    {item.type}
                  </span>
                </li>
              ))}
              {selectedVideosCount > 5 && <li>...and {selectedVideosCount - 5} more</li>}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmSave} disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Assigning...
              </>
            ) : (
              'Confirm Assignment'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoController;