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
} from "react-bootstrap";
import {
  FaLock,
  FaUnlock,
  FaClock,
  FaFilter,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getChildrenByParentIdApi } from "../../../services/parentApi";


const ParentalControls = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null); // Track which child is being updated

  // Fetch children data on component mount
  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError("");
      // You need to get the parentId from your auth context or props
      const parentId = localStorage.getItem("parentId") || "current-user-id"; // Replace with actual parent ID
      const response = await getChildrenByParentIdApi(parentId);
      setChildren(response.data || response); // Adjust based on your API response structure
    } catch (err) {
      setError(err.message || "Failed to fetch children data");
      console.error("Error fetching children:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (childId, currentStatus) => {
    try {
      setUpdating(childId);
      setError("");

      // Convert current status to boolean and toggle it
      const newStatus = !currentStatus;

      await updateChildStatusApi(childId, newStatus);

      // Update local state after successful API call
      setChildren((prevChildren) =>
        prevChildren.map((child) =>
          child.id === childId ? { ...child, is_active: newStatus } : child
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update child status");
      console.error("Error updating child status:", err);
    } finally {
      setUpdating(null);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading parental controls...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">🛡️ Parental Controls</h2>

      {error && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* Screen Time & Filters */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">
                <FaClock className="me-2" /> Screen Time
              </h5>
              {children.length > 0 ? (
                children.map((child) => (
                  <div key={child.id} className="mb-3">
                    <strong>
                      {child.name || child.username || `Child ${child.id}`}
                    </strong>
                    <ProgressBar
                      now={50} // Placeholder - adjust based on your screen time data
                      label={`2h / 4h`} // Placeholder - adjust based on your screen time data
                      className="mt-1"
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted">No children found</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Lock Accounts - Dynamic with API */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold mb-0">
                  <FaLock className="me-2" /> Account Lock
                </h5>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={fetchChildren}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </div>

              {children.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Child</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child) => (
                      <tr key={child.id}>
                        <td>
                          {child.name || child.username || `Child ${child.id}`}
                        </td>
                        <td>
                          {child.is_active ? (
                            <span className="text-success">Unlocked</span>
                          ) : (
                            <span className="text-danger">Locked</span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant={child.is_active ? "danger" : "success"}
                            size="sm"
                            onClick={() =>
                              toggleLock(child.id, child.is_active)
                            }
                            disabled={updating === child.id}
                          >
                            {updating === child.id ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1"
                              />
                            ) : child.is_active ? (
                              <FaLock className="me-1" />
                            ) : (
                              <FaUnlock className="me-1" />
                            )}
                            {child.is_active ? "Lock" : "Unlock"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No children accounts found</p>
                  <Button variant="primary" onClick={fetchChildren}>
                    Try Again
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentalControls;
