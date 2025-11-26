import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Alert,
  Spinner,
  Modal,
  Badge,
} from "react-bootstrap";
import { FaLock, FaUnlock, FaSync, FaExclamationTriangle, FaUser } from "react-icons/fa";
import { getChildrenByParentIdApi, updateChildStatusApi } from "../../../services/parentApi";
import { useUser } from "../../../context/UserContext";
import VideoControler from "../../../components/parent/VideoControler";

const ParentalControls = () => {
  const { user } = useUser();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    if (!user) {
      setError("User not found. Please log in again.");
      setLoading(false);
      return;
    }

    const parentId = user.parent_id || user.parentId || user.id || user.user_id;

    if (!parentId) {
      setError("Parent ID not found in user data.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getChildrenByParentIdApi(parentId);

      const childrenData = response.data?.children || response.data || response;

      setChildren(
        Array.isArray(childrenData)
          ? childrenData.map((child) => ({
              id: child.child_id || child.id,
              name: child.name || child.child_name || "Unnamed Child",
              is_active: child.is_active !== undefined ? child.is_active : true,
              color: child.color || "#3498db",
              last_used: child.last_used || child.updated_at || child.created_at,
            }))
          : []
      );
    } catch (err) {
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
      await updateChildStatusApi(selectedChild.id, newStatus);

      setChildren((prevChildren) =>
        prevChildren.map((child) =>
          child.id === selectedChild.id
            ? { ...child, is_active: newStatus }
            : child
        )
      );

      setSuccess(
        `Successfully ${newStatus ? "unlocked" : "locked"} ${selectedChild.name}'s account`
      );
    } catch (err) {
      setError(err.message || `Failed to ${selectedChild.is_active ? "lock" : "unlock"} account`);
    } finally {
      setUpdating(null);
      setShowConfirmModal(false);
      setSelectedChild(null);
    }
  };

  if (!user) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning" className="text-center">
          <FaUser className="me-2" />
          Please log in to access parental controls.
        </Alert>
      </Container>
    );
  }

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
        <div>
          <h2 className="fw-bold mb-0">🛡️ Parental Controls</h2>
          <small className="text-muted">
            Managing accounts for {user.name || user.email}
          </small>
        </div>
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
        <Col md={12}>
          <Card className="shadow-sm border-0 rounded-3 h-100">
            <Card.Header className="bg-transparent border-0">
              <h5 className="fw-semibold mb-0">
                <FaLock className="me-2" /> Account Lock Control
              </h5>
            </Card.Header>
            <Card.Body>
              {children.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <FaLock className="mb-2" style={{ fontSize: "2rem" }} />
                  <p>No children accounts to manage.</p>
                  <small>Add children to enable account locking features.</small>
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
                          {child.is_active ? (
                            <Badge bg="success">Active</Badge>
                          ) : (
                            <Badge bg="danger">Locked</Badge>
                          )}
                        </td>
                        <td>
                          <small className="text-muted">
                            {child.last_used
                              ? new Date(child.last_used).toLocaleDateString()
                              : "Never"}
                          </small>
                        </td>
                        <td>
                          <Button
                            variant={child.is_active ? "outline-danger" : "outline-success"}
                            size="sm"
                            onClick={() => toggleLock(child)}
                            disabled={updating === child.id}
                            className="w-100"
                          >
                            {updating === child.id ? (
                              <Spinner animation="border" size="sm" />
                            ) : child.is_active ? (
                              <>
                                <FaLock className="me-1" />
                                Lock
                              </>
                            ) : (
                              <>
                                <FaUnlock className="me-1" />
                                Unlock
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
        <VideoControler />
      </Row>

      <Modal className="mt-4" show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Action</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to{" "}
          {selectedChild?.is_active ? "lock" : "unlock"}{" "}
          <strong>{selectedChild?.name}</strong>'s account?
          {selectedChild?.is_active && (
            <div className="alert alert-warning mt-2 mb-0">
              <FaExclamationTriangle className="me-2" />
              Locking will prevent the child from accessing their account.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
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
                {selectedChild?.is_active ? (
                  <FaLock className="me-1" />
                ) : (
                  <FaUnlock className="me-1" />
                )}
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