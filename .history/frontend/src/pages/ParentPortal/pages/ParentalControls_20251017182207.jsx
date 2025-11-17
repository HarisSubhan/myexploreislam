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
} from "react-bootstrap";
import { FaLock, FaUnlock, FaClock, FaFilter } from "react-icons/fa";
import {
  getChildrenByParentIdApi,
  updateChildStatusApi,
} from "../../../services/parentApi";

const ParentalControls = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const parentId = 1;

      // Debug: Log the API call
      console.log("Fetching children for parent:", parentId);

      const response = await getChildrenByParentIdApi(parentId);

      // Debug: Log the entire response
      console.log("API Response:", response);

      // Check the response structure
      if (!response) {
        throw new Error("No response received from API");
      }

      // The data might be in response.data or directly in response
      const childrenData = response.data || response;

      // Handle different possible response structures
      let childrenArray;
      if (Array.isArray(childrenData)) {
        childrenArray = childrenData;
      } else if (
        childrenData.children &&
        Array.isArray(childrenData.children)
      ) {
        childrenArray = childrenData.children;
      } else if (childrenData.data && Array.isArray(childrenData.data)) {
        childrenArray = childrenData.data;
      } else {
        throw new Error("Unexpected response format");
      }

      console.log("Children array:", childrenArray);

      const transformedChildren = childrenArray.map((child) => ({
        id: child.id || child.child_id,
        name: child.name || child.child_name || "Unknown",
        screenTime: child.screen_time || child.screenTime || 2,
        locked: !child.is_active,
        is_active: child.is_active,
      }));

      setChildren(transformedChildren);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.message || "Failed to fetch children data");
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (id) => {
    try {
      const child = children.find((c) => c.id === id);
      const newStatus = child.is_active ? 0 : 1;

      console.log("Updating child status:", { id, newStatus });

      const response = await updateChildStatusApi(id, newStatus);
      console.log("Update response:", response);

      setChildren(
        children.map((child) =>
          child.id === id
            ? {
                ...child,
                locked: !newStatus,
                is_active: newStatus,
              }
            : child
        )
      );
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update child status");
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">Loading...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <div className="alert alert-danger">{error}</div>
        <div className="text-center">
          <Button variant="primary" onClick={fetchChildren}>
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">🛡️ Parental Controls</h2>

      <Row className="g-4">
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
                    />
                  </div>
                ))
              ) : (
                <div className="text-center text-muted">No children found</div>
              )}
            </Card.Body>
          </Card>
        </Col>

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
                          >
                            {child.locked ? (
                              <FaUnlock className="me-1" />
                            ) : (
                              <FaLock className="me-1" />
                            )}
                            {child.locked ? "Unlock" : "Lock"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center text-muted">
                  No children to manage
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
