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
      // You'll need to get the parent ID from your auth context or props
      const parentId = localStorage.getItem("parentId") || "current-parent-id"; // Replace with actual parent ID
      const childrenData = await getChildrenByParentIdApi(parentId);

      // Transform API data to match component structure
      const transformedChildren = childrenData.map((child) => ({
        id: child.child_id || child.id,
        name: child.name || child.username,
        screenTime: child.screen_time || 2, // Default value if not provided
        locked: !child.is_active, // Assuming is_active determines lock status
        is_active: child.is_active,
      }));

      setChildren(transformedChildren);
    } catch (err) {
      setError(err.message || "Failed to fetch children data");
      console.error("Error fetching children:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (id) => {
    try {
      setUpdating(id);
      setError("");

      const child = children.find((c) => c.id === id);
      const newStatus = !child.locked;

      // Update via API
      await updateChildStatusApi(id, newStatus);

      // Update local state
      setChildren(
        children.map((child) =>
          child.id === id
            ? {
                ...child,
                locked: newStatus,
                is_active: !newStatus,
              }
            : child
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update child status");
      console.error("Error updating child status:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
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
                    <strong>{child.name}</strong>
                    <ProgressBar
                      now={(child.screenTime / 4) * 100}
                      label={`${child.screenTime}h / 4h`}
                      className="mt-1"
                      variant={child.locked ? "secondary" : "primary"}
                    />
                    {child.locked && (
                      <small className="text-muted d-block mt-1">
                        Account is locked - no screen time available
                      </small>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted">No children found</p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Lock Accounts */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">
                <FaLock className="me-2" /> Account Lock
              </h5>
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
                        <td>{child.name}</td>
                        <td>
                          {child.locked ? (
                            <span className="text-danger">Locked</span>
                          ) : (
                            <span className="text-success">Unlocked</span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant={child.locked ? "success" : "danger"}
                            size="sm"
                            onClick={() => toggleLock(child.id)}
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
                            ) : child.locked ? (
                              <FaUnlock className="me-1" />
                            ) : (
                              <FaLock className="me-1" />
                            )}
                            {updating === child.id
                              ? "Updating..."
                              : child.locked
                                ? "Unlock"
                                : "Lock"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">No children accounts found</p>
                  <Button variant="primary" onClick={fetchChildren}>
                    Retry
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
