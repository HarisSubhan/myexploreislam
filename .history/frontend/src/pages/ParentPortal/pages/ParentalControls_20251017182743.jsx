import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Table,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FaLock,
  FaUnlock,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { getChildrenByParentIdApi } from "../../../services/parentApi";


const ParentalControls = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError("");

      // Get parent ID from your authentication system
      const parentId = localStorage.getItem("parentId") || "current-parent-id";

      const response = await getChildrenByParentIdApi(parentId);

      // Handle different response formats
      let childrenArray = [];

      if (Array.isArray(response)) {
        // If response is directly an array
        childrenArray = response;
      } else if (response && Array.isArray(response.children)) {
        // If response has children property
        childrenArray = response.children;
      } else if (response && Array.isArray(response.data)) {
        // If response has data property
        childrenArray = response.data;
      } else if (response && typeof response === "object") {
        // If response is a single child object, wrap in array
        childrenArray = [response];
      } else {
        // If no children found or unexpected format
        childrenArray = [];
      }

      console.log("Raw API response:", response);
      console.log("Processed children array:", childrenArray);

      // Transform to component structure with safe property access
      const transformedChildren = childrenArray.map((child, index) => ({
        id: child.child_id || child.id || index,
        name: child.name || child.username || `Child ${index + 1}`,
        screenTime: child.screen_time || child.screenTime || 2,
        locked: !(child.is_active !== undefined ? child.is_active : true), // Default to unlocked if not specified
        is_active: child.is_active !== undefined ? child.is_active : true,
      }));

      setChildren(transformedChildren);
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch children data";
      setError(errorMessage);
      console.error("Error fetching children:", err);

      // Set empty array on error
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (id) => {
    try {
      setUpdating(id);
      setError("");

      const child = children.find((c) => c.id === id);
      if (!child) {
        throw new Error("Child not found");
      }

      const newStatus = !child.locked;
      const isActive = !newStatus; // locked = !is_active

      console.log(`Updating child ${id} to is_active: ${isActive}`);

      // Update via API
      await updateChildStatusApi(id, isActive);

      // Update local state
      setChildren(
        children.map((child) =>
          child.id === id
            ? {
                ...child,
                locked: newStatus,
                is_active: isActive,
              }
            : child
        )
      );
    } catch (err) {
      const errorMessage = err.message || "Failed to update child status";
      setError(errorMessage);
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
          <span className="ms-2">Loading children data...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">🛡️ Parental Controls</h2>

      {error && (
        <Alert
          variant="danger"
          className="mb-4"
          dismissible
          onClose={() => setError("")}
        >
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      <Row className="g-4">
        {/* Screen Time */}
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
                <div className="text-center py-3">
                  <p className="text-muted">No children accounts found</p>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={fetchChildren}
                  >
                    Refresh
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Account Lock */}
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
                            <span className="text-danger fw-semibold">
                              Locked
                            </span>
                          ) : (
                            <span className="text-success fw-semibold">
                              Unlocked
                            </span>
                          )}
                        </td>
                        <td>
                          <Button
                            variant={child.locked ? "success" : "danger"}
                            size="sm"
                            onClick={() => toggleLock(child.id)}
                            disabled={updating === child.id}
                            className="d-flex align-items-center"
                          >
                            {updating === child.id ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-1"
                                />
                                Updating...
                              </>
                            ) : (
                              <>
                                {child.locked ? (
                                  <FaUnlock className="me-1" />
                                ) : (
                                  <FaLock className="me-1" />
                                )}
                                {child.locked ? "Unlock" : "Lock"}
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">
                    No children accounts available
                  </p>
                  <Button variant="primary" onClick={fetchChildren}>
                    Refresh Data
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
