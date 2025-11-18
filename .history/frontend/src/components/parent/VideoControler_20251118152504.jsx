import React, { useState, useEffect } from "react";
import { Table, Button, Form, Dropdown, Alert, Spinner, Modal, Card, Badge } from "react-bootstrap";
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
      
      setSuccess(`✅ Successfully assigned ${selectedItems.length} items to ${selectedChild.name}`);
      
      setFilteredVideos(prev => 
        prev.map(v => ({ ...v, checked: false }))
      );
      
      setShowConfirmModal(false);
      
    } catch (err) {
      setError("❌ Failed to assign content. Please try again.");
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
    setSuccess("Selections cleared");
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h5>Loading Content...</h5>
        <p className="text-muted">Please wait while we fetch available videos and series</p>
      </div>
    );
  }

  const selectedVideosCount = filteredVideos.filter(v => v.checked).length;

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="text-primary mb-1">Video Controller</h2>
          <p className="text-muted">Manage video content assignments for your children</p>
        </div>
        <Badge bg="light" text="dark" className="fs-6">
          {filteredVideos.length} Items
        </Badge>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">
          <Alert.Heading className="h6">Error</Alert.Heading>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")} className="mb-4">
          <Alert.Heading className="h6">Success</Alert.Heading>
          {success}
        </Alert>
      )}

      <div className="row">
        {/* Left Sidebar - Controls */}
        <div className="col-md-3">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Controls</h5>
            </Card.Header>
            <Card.Body>
              {/* Child Selection */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Select Child</label>
                <Dropdown onSelect={handleSelectChild}>
                  <Dropdown.Toggle 
                    variant={selectedChild ? "outline-success" : "outline-primary"} 
                    className="w-100 text-start"
                  >
                    {selectedChild ? (
                      <span>
                        <i className="bi bi-person-check me-2"></i>
                        {selectedChild.name}
                      </span>
                    ) : (
                      <span>
                        <i className="bi bi-person me-2"></i>
                        Select Child
                      </span>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {children.map((child) => (
                      <Dropdown.Item 
                        key={child.id} 
                        eventKey={child.id}
                        className="d-flex align-items-center"
                      >
                        <i className="bi bi-person-circle me-2"></i>
                        {child.name}
                        {child.age && <Badge bg="secondary" className="ms-2">Age: {child.age}</Badge>}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Content Type Filter */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Content Type</label>
                <div className="d-grid gap-2">
                  {["all", "series", "single"].map(type => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "primary" : "outline-secondary"}
                      onClick={() => handleTypeChange(type)}
                      size="sm"
                      className="text-start"
                    >
                      <i className={`bi me-2 ${
                        type === "all" ? "bi-collection" : 
                        type === "series" ? "bi-film" : "bi-play-circle"
                      }`}></i>
                      {type === "all" ? "All Content" : 
                       type === "series" ? "Series Only" : "Single Videos"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selection Summary */}
              {selectedChild && (
                <Card className="bg-light">
                  <Card.Body className="py-3">
                    <h6 className="card-title">Selection Summary</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Selected Items:</span>
                      <Badge bg={selectedVideosCount > 0 ? "success" : "secondary"}>
                        {selectedVideosCount}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <small className="text-muted">For: {selectedChild.name}</small>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Main Content - Videos Table */}
        <div className="col-md-9">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Available Content</h5>
                <div>
                  {selectedVideosCount > 0 && (
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={clearSelections}
                      className="me-2"
                    >
                      <i className="bi bi-x-circle me-1"></i>
                      Clear ({selectedVideosCount})
                    </Button>
                  )}
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={fetchVideosAndSeries}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Refresh
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th width="60" className="text-center">Select</th>
                    <th width="100">Type</th>
                    <th>Content Details</th>
                    <th width="120" className="text-center">ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((item) => (
                      <tr 
                        key={`${item.type}-${item.id}`}
                        className={item.checked ? "table-active" : ""}
                      >
                        <td className="text-center">
                          <Form.Check
                            type="checkbox"
                            checked={item.checked || false}
                            onChange={() => handleCheckboxChange(item.id)}
                            disabled={!selectedChild}
                          />
                        </td>
                        <td>
                          <Badge 
                            bg={item.type === 'series' ? 'warning' : 'info'} 
                            className="text-capitalize"
                          >
                            {item.type === 'series' ? (
                              <><i className="bi bi-collection-play me-1"></i>Series</>
                            ) : (
                              <><i className="bi bi-play-btn me-1"></i>Video</>
                            )}
                          </Badge>
                        </td>
                        <td>
                          <div>
                            <h6 className="mb-1 text-primary">
                              {item.title || item.name || item.video || 'Untitled'}
                            </h6>
                            {item.description && (
                              <p className="text-muted small mb-0">
                                {item.description.length > 120 
                                  ? `${item.description.substring(0, 120)}...` 
                                  : item.description
                                }
                              </p>
                            )}
                            {item.age && (
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                Recommended age: {item.age}
                              </small>
                            )}
                          </div>
                        </td>
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        <div className="text-muted">
                          <i className="bi bi-inbox display-4"></i>
                          <h5 className="mt-3">No Content Available</h5>
                          <p>No videos or series found for the selected filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          {selectedChild && (
            <Card className="mt-4 shadow-sm border-0 bg-gradient">
              <Card.Body className="text-center py-4">
                <div className="row align-items-center">
                  <div className="col-md-8 text-md-start">
                    <h5 className="mb-1">Ready to Assign Content</h5>
                    <p className="text-muted mb-0">
                      {selectedVideosCount > 0 
                        ? `${selectedVideosCount} items selected for ${selectedChild.name}`
                        : `Select videos or series to assign to ${selectedChild.name}`
                      }
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end">
                    <Button 
                      variant="success" 
                      size="lg"
                      onClick={handleSave}
                      disabled={!selectedChild || selectedVideosCount === 0 || saving}
                      className="px-4"
                    >
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Assigning...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Assign Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal 
        show={showConfirmModal} 
        onHide={() => !saving && setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton={!saving} className="bg-primary text-white">
          <Modal.Title>
            <i className="bi bi-shield-check me-2"></i>
            Confirm Assignment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <i className="bi bi-question-circle display-4 text-primary"></i>
          </div>
          <h5 className="text-center mb-3">
            Assign {selectedVideosCount} items to {selectedChild?.name}?
          </h5>
          <p className="text-muted text-center">
            This action will assign the selected videos and series to the child's account.
            They will be able to access this content immediately.
          </p>
          
          {selectedVideosCount > 0 && (
            <div className="mt-4">
              <h6>Selected Items:</h6>
              <div className="bg-light p-3 rounded" style={{maxHeight: '150px', overflowY: 'auto'}}>
                <ul className="list-unstyled mb-0">
                  {filteredVideos.filter(v => v.checked).slice(0, 5).map((item, index) => (
                    <li key={item.id} className="py-1">
                      <small>
                        <Badge bg={item.type === 'series' ? 'warning' : 'info'} className="me-2">
                          {item.type}
                        </Badge>
                        {item.title || item.name || item.video}
                      </small>
                    </li>
                  ))}
                  {selectedVideosCount > 5 && (
                    <li className="py-1">
                      <small className="text-muted">
                        ...and {selectedVideosCount - 5} more items
                      </small>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowConfirmModal(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmSave} 
            disabled={saving}
            className="px-4"
          >
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Assigning...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>
                Confirm Assignment
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VideoController;