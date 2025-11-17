import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ProgressBar,
  Table,
  Alert,
  Spinner,
  Modal,
  Badge
} from "react-bootstrap";
import { FaLock, FaUnlock, FaClock, FaFilter, FaSync, FaExclamationTriangle } from "react-icons/fa";
import { updateChildStatusApi, getChildrenByParentIdApi } from "../services/api"; // Adjust import path as needed

const ParentalControls = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [parentId, setParentId] = useState(""); // You'll need to get this from auth context or props

  // Fetch children data on component mount
  useEffect(() => {
    fetchChildren();
  }, []);

  // Get parent ID from your authentication context or localStorage
  useEffect(() => {
    // This should come from your auth context or user data
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setParentId(userData.parentId || userData.id || "");
  }, []);

  const fetchChildren = async () => {
    if (!parentId) {
      setError("Parent ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getChildrenByParentIdApi(parentId);
      
      // Transform API response to match component structure
      const childrenData = response.data?.children || response.data || response;
      
      setChildren(Array.isArray(childrenData) ? childrenData.map(child => ({
        id: child.child_id || child.id,
        name: child.name || child.child_name,
        screenTime: child.screen_time_limit || child.daily_limit || 0,
        maxScreenTime: child.max_screen_time || 4, // Default to 4 hours
        locked: !child.is_active, // Assuming is_active determines lock status
        is_active: child.is_active,
        color: child.color || "#3498db",
        last_used: child.last_used || child.updated_at
      })) : []);
      
    } catch (err) {
      console.error("Failed to fetch children:", err);
      setError(err.message || "Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (child) => {
    setSelectedChild(child);
    setShowConfirmModal(true);
  };

  const confirmToggleLock = async () => {
    if (!selectedChild) return;

    try {
      setUpdating(selectedChild.id);
      setError("");
      setSuccess("");

      const newStatus = !selectedChild.is_active;
      
      // Call API to update child status
      await updateChildStatusApi(selectedChild.id, newStatus);
      
      // Update local state
      setChildren(prevChildren =>
        prevChildren.map(child =>
          child.id === selectedChild.id
            ? { 
                ...child, 
                locked: !newStatus, 
                is_active: newStatus 
              }
            : child
        )
      );

      setSuccess(
        `Successfully ${newStatus ? "unlocked" : "locked"} ${selectedChild.name}'s account`
      );
      
    } catch (err) {
      console.error("Failed to update child status:", err);
      setError(err.message || `Failed to ${selectedChild.is_active ? "lock" : "unlock"} account`);
    } finally {
      setUpdating(null);
      setShowConfirmModal(false);
      setSelectedChild(null);
    }
  };

  const handleScreenTimeChange = async (childId, newScreenTime) => {
    try {
      setUpdating(childId);
      setError("");
      
      // Here you would call your API to update screen time
      // await updateChildScreenTimeApi(childId, newScreenTime);
      
      // Update local state temporarily
      setChildren(prevChildren =>
        prevChildren.map(child =>
          child.id === childId
            ? { ...child, screenTime: newScreenTime }
            : child
        )
      );
      
      setSuccess("Screen time updated successfully");
    } catch (err) {
      console.error("Failed to update screen time:", err);
      setError(err.message || "Failed to update screen time");
    } finally {
      setUpdating(null);
    }
  };

  const getScreenTimePercentage = (child) => {
    return (child.screenTime / child.maxScreenTime) * 100;
  };

  const getProgressVariant = (percentage) => {
    if (percentage >= 90) return "danger";
    if (percentage >= 70) return "warning";
    return "success";
  };

  const getStatusBadge = (child) => {
    if (child.locked) {
      return <Badge bg="danger">Locked</Badge>;
    }
    return <Badge bg="success">Active</Badge>;
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Loading parental controls...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">🛡️ Parental Controls</h2>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={fetchChildren}
          disabled={loading}
        >
          <FaSync className={loading ? "spin" : ""} />
          {loading ? " Refreshing..." : " Refresh"}
        </Button>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      <Row className="g-4">
        {/* Screen Time Management */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Header className="bg-transparent border-0">
              <h5 className="fw-semibold mb-0">
                <FaClock className="me-2" /> Screen Time Management
              </h5>
            </Card.Header>
            <Card.Body>
              {children.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No children found. Add children to manage screen time.
                </div>
              ) : (
                children.map((child) => (
                  <div key={child.id} className="mb-4 p-3 border rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className="d-flex align-items-center">
                        <div
                          className="me-2 rounded-circle"
                          style={{
                            width: "12px",
                            height: "12px",
                            backgroundColor: child.color,
                          }}
                        ></div>
                        {child.name}
                      </strong>
                      {getStatusBadge(child)}
                    </div>
                    
                    <ProgressBar
                      now={getScreenTimePercentage(child)}
                      variant={getProgressVariant(getScreenTimePercentage(child))}
                      className="mb-2"
                      style={{ height: "8px" }}
                    />
                    
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {child.screenTime}h / {child.maxScreenTime}h daily
                      </small>
                      
                      <Form.Select
                        size="sm"
                        style={{ width: "80px" }}
                        value={child.screenTime}
                        onChange={(e) => 
                          handleScreenTimeChange(child.id, parseInt(e.target.value))
                        }
                        disabled={updating === child.id || child.locked}
                      >
                        {[0, 1, 2, 3, 4, 5, 6].map((hours) => (
                          <option key={hours} value={hours}>
                            {hours}h
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    
                    {updating === child.id && (
                      <div className="text-center mt-2">
                        <Spinner animation="border" size="sm" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Account Lock Control */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Header className="bg-transparent border-0">
              <h5 className="fw-semibold mb-0">
                <FaLock className="me-2" /> Account Lock Control
              </h5>
            </Card.Header>
            <Card.Body>
              {children.length === 0 ? (
                <div className="text-center text-muted py-4">
                  No children found. Add children to manage account locks.
                </div>
              ) : (
                <Table striped bordered hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Child</th>
                      <th>Status</th>
                      <th>Last Activity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child) => (
                      <tr key={child.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="me-2 rounded-circle"
                              style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: child.color,
                              }}
                            ></div>
                            {child.name}
                          </div>
                        </td>
                        <td>
                          {child.locked ? (
                            <span className="text-danger fw-semibold">Locked</span>
                          ) : (
                            <span className="text-success fw-semibold">Active</span>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {child.last_used 
                              ? new Date(child.last_used).toLocaleDateString()
                              : "Never"
                            }
                          </small>
                        </td>
                        <td>
                          <Button
                            variant={child.locked ? "outline-success" : "outline-danger"}
                            size="sm"
                            onClick={() => toggleLock(child)}
                            disabled={updating === child.id}
                            className="w-100"
                          >
                            {updating === child.id ? (
                              <Spinner animation="border" size="sm" />
                            ) : child.locked ? (
                              <>
                                <FaUnlock className="me-1" />
                                Unlock
                              </>
                            ) : (
                              <>
                                <FaLock className="me-1" />
                                Lock
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {selectedChild?.is_active ? "lock" : "unlock"}{" "}
          <strong>{selectedChild?.name}</strong>'s account?
          {selectedChild?.is_active && (
            <div className="alert alert-warning mt-2 mb-0">
              <FaExclamationTriangle className="me-2" />
              Locking will prevent the child from accessing their account.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button 
            variant={selectedChild?.is_active ? "danger" : "success"}
            onClick={confirmToggleLock}
            disabled={updating}
          >
            {updating ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {selectedChild?.is_active ? "Locking..." : "Unlocking..."}
              </>
            ) : (
              <>
                {selectedChild?.is_active ? <FaLock className="me-1" /> : <FaUnlock className="me-1" />}
                {selectedChild?.is_active ? "Lock Account" : "Unlock Account"}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default ParentalControls;