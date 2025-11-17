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
import { getChildrenByParentIdApi, updateChildStatusApi } from "../../../services/parentApi";


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
      const response = await getChildrenByParentIdApi(parentId);


      const childrenData = response.data.map((child) => ({
        id: child.id,
        name: child.name,
        screenTime: child.screen_time || 2, 
        locked: !child.is_active, 
        is_active: child.is_active,
      }));

      setChildren(childrenData);
    } catch (err) {
      setError("Failed to fetch children data");
      console.error("Error fetching children:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLock = async (id) => {
    try {
      const child = children.find((c) => c.id === id);
      const newStatus = child.is_active ? 0 : 1; // Toggle status: 1 to 0 or 0 to 1

      // Update child status via API
      const response = await updateChildStatusApi(id, newStatus);

      // Update local state with the new status
      setChildren(
        children.map((child) =>
          child.id === id
            ? {
                ...child,
                locked: !newStatus, // locked is opposite of is_active
                is_active: newStatus,
              }
            : child
        )
      );

      console.log(response.message); // "Child status updated successfully"
    } catch (err) {
      setError("Failed to update child status");
      console.error("Error updating child status:", err);
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
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">🛡️ Parental Controls</h2>

      <Row className="g-4">
        {/* Screen Time & Filters */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">
                <FaClock className="me-2" /> Screen Time
              </h5>
              {children.map((child) => (
                <div key={child.id} className="mb-3">
                  <strong>{child.name}</strong>
                  <ProgressBar
                    now={(child.screenTime / 4) * 100}
                    label={`${child.screenTime}h / 4h`}
                    className="mt-1"
                  />
                </div>
              ))}
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentalControls;
