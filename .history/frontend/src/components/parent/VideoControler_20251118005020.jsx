import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner, Modal, Card } from "react-bootstrap";
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
  const [searchTerm, setSearchTerm] = useState("");

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
    setError("");
    try {
      const response = await getChildrenByParentIdApi(parentId);
      setChildren(response.data || []);
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
      setError("Failed to fetch content. Please try again.");
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
      const selectedVideos = filteredVideos.filter(v => v.checked);
      
      const assignData = {
        childId: selectedChild.id,
        content: selectedVideos.map(item => ({
          contentId: item.id,
          contentType: item.type === 'series' ? 'series' : 'video',
          title: item.title || item.name || item.video || 'Untitled',
          age: item.age || item.recommendedAge || 'N/A',
          description: item.description || ''
        }))
      };

      const response = await assignContentToChildApi(assignData);
      
      setSuccess(`Successfully assigned ${selectedVideos.length} item(s) to ${selectedChild.name}! Assignment ID: ${response.id}`);
      
      // Clear selections
      setFilteredVideos(prev => 
        prev.map(v => ({ ...v, checked: false }))
      );
      
      setShowConfirmModal(false);
      
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign content. Please try again.");
      console.error("Error assigning content:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setError("");
    let filtered = [];
    
    if (type === "series") {
      filtered = series;
    } else if (type === "single") {
      filtered = videos;
    } else {
      filtered = [...series, ...videos];
    }
    
    // Apply search filter if exists
    if (searchTerm) {
      filtered = filtered.filter(item => 
        (item.title || item.name || item.video || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredVideos(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    
    let baseData = [];
    if (selectedType === "series") {
      baseData = series;
    } else if (selectedType === "single") {
      baseData = videos;
    } else {
      baseData = [...series, ...videos];
    }
    
    if (term) {
      const filtered = baseData.filter(item => 
        (item.title || item.name || item.video || '')
          .toLowerCase()
          .includes(term.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(baseData);
    }
  };

  const handleRowClick = async (item) => {
    if (!selectedChild) {
      setError("Please select a child first!");
      return;
    }

    if (item.type === 'single') {
      try {
        setLoading(true);
        const videoData = await videoService.getVideoById(item.id);
        setSuccess(`Video "${videoData.title || item.title || 'Video'}" selected for ${selectedChild.name}`);
      } catch (err) {
        setError("Failed to fetch video details.");
      } finally {
        setLoading(false);
      }
    } else {
      setSuccess(`Series "${item.title || item.name || 'Series'}" selected for ${selectedChild.name}`);
    }
  };

  const clearSelections = () => {
    setFilteredVideos(prev => 
      prev.map(v => ({ ...v, checked: false }))
    );
    setSuccess("Selections cleared.");
  };

  if (loading || childrenLoading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading content...</p>
      </div>
    );
  }

  const selectedVideosCount = filteredVideos.filter(v => v.checked).length;
  const allSelected = filteredVideos.length > 0 && filteredVideos.every(v => v.checked);
  const someSelected = filteredVideos.some(v => v.checked) && !allSelected;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Video Controller</h3>
        <Button 
          variant="outline-primary" 
          onClick={fetchVideosAndSeries}
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise"></i> Refresh Content
        </Button>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess("")} dismissible>
          <i className="bi bi-check-circle-fill"></i> {success}
        </Alert>
      )}

      {/* Child Selection Card */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Child Selection</h5>
        </Card.Header>
        <Card.Body>
          <div className="row align-items-center">
            <div className="col-md-6">
              <label className="form-label fw-bold">Select Child:</label>
              <Dropdown onSelect={handleSelectChild}>
                <Dropdown.Toggle variant="primary" className="w-100">
                  {selectedChild ? (
                    <>
                      <i className="bi bi-person-fill"></i> {selectedChild.name}
                    </>
                  ) : (
                    "Select Child"
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {children.length > 0 ? (
                    children.map((child) => (
                      <Dropdown.Item key={child.id} eventKey={child.id}>
                        <i className="bi bi-person"></i> {child.name}
                        {child.age && ` (Age: ${child.age})`}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>
                      {childrenLoading ? "Loading children..." : "No children found"}
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
              {children.length === 0 && !childrenLoading && (
                <div className="text-muted mt-2">
                  <i className="bi bi-info-circle"></i> No children available. Please add children to your account.
                </div>
              )}
            </div>
            <div className="col-md-6">
              {selectedChild && (
                <div className="bg-light p-3 rounded">
                  <h6 className="mb-1">Selected Child:</h6>
                  <p className="mb-0 fw-bold text-primary">
                    <i className="bi bi-person-check-fill"></i> {selectedChild.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Filters Card */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Content Filters</h5>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label fw-bold">Content Type:</label>
              <div>
                {["all", "series", "single"].map(type => (
                  <Form.Check
                    key={type}
                    inline
                    type="radio"
                    label={
                      type === "all" ? "All Content" : 
                      type === "series" ? "Series Only" : "Single Videos Only"
                    }
                    name="contentType"
                    checked={selectedType === type}
                    onChange={() => handleTypeChange(type)}
                    disabled={!selectedChild}
                  />
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">Search Content:</label>
              <Form.Control
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={!selectedChild}
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Content Table Card */}
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Available Content 
            <span className="badge bg-secondary ms-2">{filteredVideos.length}</span>
          </h5>
          {selectedChild && filteredVideos.length > 0 && (
            <div className="d-flex align-items-center">
              <Form.Check
                type="checkbox"
                label="Select All"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="me-3"
              />
              {selectedVideosCount > 0 && (
                <Button variant="outline-danger" size="sm" onClick={clearSelections}>
                  Clear ({selectedVideosCount})
                </Button>
              )}
            </div>
          )}
        </Card.Header>
        <Card.Body className="p-0">
          <Table bordered hover responsive className="mb-0">
            <thead className="bg-light">
              <tr>
                <th style={{ width: "60px" }}>Select</th>
                <th style={{ width: "100px" }}>Type</th>
                <th>Title</th>
                <th style={{ width: "100px" }}>Age</th>
                <th style={{ width: "150px" }}>Actions</th>
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
                    <td>
                      <div>
                        <strong>{item.title || item.name || item.video || 'Untitled'}</strong>
                        {item.description && (
                          <div className="text-muted small mt-1">
                            {item.description.length > 100 
                              ? `${item.description.substring(0, 100)}...` 
                              : item.description
                            }
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary">
                        {item.age || item.recommendedAge || 'N/A'}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleRowClick(item)}
                        disabled={!selectedChild}
                      >
                        <i className="bi bi-eye"></i> Preview
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-inbox display-4"></i>
                      <p className="mt-2">
                        {searchTerm ? 'No content found matching your search.' : 'No content available.'}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleSearch('')}
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Actions */}
      {selectedChild && (
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Selected: {selectedVideosCount} item(s)</h6>
                <p className="text-muted mb-0">for {selectedChild.name}</p>
              </div>
              <div>
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handleSave}
                  disabled={selectedVideosCount === 0 || saving}
                  className="me-2"
                >
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill"></i> Assign Content
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={clearSelections}
                  disabled={selectedVideosCount === 0}
                >
                  Clear
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => !saving && setShowConfirmModal(false)}>
        <Modal.Header closeButton={!saving}>
          <Modal.Title>
            <i className="bi bi-shield-check text-primary"></i> Confirm Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            <i className="bi bi-info-circle"></i> You are about to assign content to {selectedChild?.name}.
          </div>
          
          <p><strong>Number of items:</strong> {selectedVideosCount}</p>
          
          <div className="mt-3">
            <h6>Selected Items Preview:</h6>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <ul className="list-group">
                {filteredVideos.filter(v => v.checked).slice(0, 10).map((item, index) => (
                  <li key={item.id} className="list-group-item py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold">{index + 1}. </span>
                        {item.title || item.name || item.video}
                      </div>
                      <span className={`badge ${item.type === 'series' ? 'bg-warning' : 'bg-info'}`}>
                        {item.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              {selectedVideosCount > 10 && (
                <div className="text-center mt-2">
                  <span className="text-muted">...and {selectedVideosCount - 10} more items</span>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="mt-5">
          <Button 
            variant="secondary" 
            onClick={() => setShowConfirmModal(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmSave} 
            disabled={saving}
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Assigning...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i> Confirm Assignment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoController;