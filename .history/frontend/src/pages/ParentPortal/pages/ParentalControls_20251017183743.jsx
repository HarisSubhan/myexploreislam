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
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaLock,
  FaUnlock,
  FaClock,
  FaExclamationTriangle,
  FaSync,
  FaPlus,
} from "react-icons/fa";
import { getChildrenByParentIdApi } from "../../../services/parentApi";


const ParentalControls = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    username: "",
    password: "",
    screen_time: 2,
  });

  // Get parent ID from your authentication system
  const getParentId = () => {
    return (
      localStorage.getItem("userId") ||
      localStorage.getItem("parentId") ||
      "current-user-id"
    );
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      setError("");

      const parentId = getParentId();
      console.log("Fetching children for parent:", parentId);

      const response = await getChildrenByParentIdApi(parentId);
      console.log("API Response:", response);

      let childrenData = [];

      // Try multiple possible response formats
      if (Array.isArray(response)) {
        childrenData = response;
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          childrenData = response.data;
        } else if (
          response.data.children &&
          Array.isArray(response.data.children)
        ) {
          childrenData = response.data.children;
        } else if (typeof response.data === "object") {
          childrenData = [response.data];
        }
      } else if (response?.children && Array.isArray(response.children)) {
        childrenData = response.children;
      } else if (response && typeof response === "object") {
        // If it's a single child object
        childrenData = [response];
      }

      console.log("Extracted children data:", childrenData);

      if (childrenData.length === 0) {
        setError(
          "No children accounts found. Please add children to your account first."
        );
        setChildren([]);
        return;
      }

      const transformedChildren = childrenData.map((child, index) => ({
        id: child.id || child.child_id || child.user_id || `temp-${index}`,
        name:
          child.name ||
          child.username ||
          child.full_name ||
          `Child ${index + 1}`,
        screenTime:
          child.screen_time || child.screenTime || child.daily_limit || 2,
        is_active: child.is_active !== undefined ? child.is_active : true,
        locked: child.is_active !== undefined ? !child.is_active : false,
      }));

      setChildren(transformedChildren);
    } catch (err) {
      console.error("Error fetching children:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch children data. Please check your connection.";
      setError(errorMessage);
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
      if (!child) return;

      const newLockStatus = !child.locked;
      const isActive = !newLockStatus;

      await updateChildStatusApi(id, isActive);

      setChildren(
        children.map((child) =>
          child.id === id
            ? {
                ...child,
                locked: newLockStatus,
                is_active: isActive,
              }
            : child
        )
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update child status";
      setError(errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      setAddingChild(true);
      setError("");

      const childData = {
        name: newChild.name,
        username: newChild.username,
        password: newChild.password,
        screen_time: newChild.screen_time,
        is_active: true, // Start as unlocked
      };

      console.log("Adding child:", childData);
      await addChildApi(childData);

      setShowAddChild(false);
      setNewChild({ name: "", username: "", password: "", screen_time: 2 });

      // Refresh the children list
      await fetchChildren();

      setError(""); // Clear any previous errors
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to add child";
      setError(errorMessage);
    } finally {
      setAddingChild(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" role="status" variant="primary" />
          <span className="ms-2">Loading children data...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">🛡️ Parental Controls</h2>
        <div>
          <Button
            variant="success"
            onClick={() => setShowAddChild(true)}
            className="me-2 d-flex align-items-center"
          >
            <FaPlus className="me-1" />
            Add Child
          </Button>
          <Button
            variant="outline-primary"
            onClick={fetchChildren}
            disabled={loading}
            className="d-flex align-items-center"
          >
            <FaSync className={loading ? "me-1 spin" : "me-1"} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant={children.length === 0 ? "warning" : "danger"}
          className="mb-4"
        >
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}

      {children.length === 0 ? (
        // Empty state when no children
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="shadow-sm border-0 rounded-3 text-center">
              <Card.Body className="py-5">
                <FaLock size={64} className="text-muted mb-3" />
                <h4 className="text-muted mb-3">No Children Accounts</h4>
                <p className="text-muted mb-4">
                  You haven't added any children to your parental controls yet.
                  <br />
                  Add children to manage their screen time and account access.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowAddChild(true)}
                  className="d-flex align-items-center mx-auto"
                >
                  <FaPlus className="me-2" />
                  Add Your First Child
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        // Normal view when children exist
        <Row className="g-4">
          <Col md={6}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body>
                <h5 className="fw-semibold mb-3">
                  <FaClock className="me-2" /> Screen Time
                </h5>
                {children.map((child) => (
                  <div key={child.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{child.name}</strong>
                      {child.locked && (
                        <span className="badge bg-danger">Locked</span>
                      )}
                    </div>
                    <ProgressBar
                      now={child.locked ? 0 : (child.screenTime / 4) * 100}
                      label={
                        child.locked ? "0h / 4h" : `${child.screenTime}h / 4h`
                      }
                      className="mt-1"
                      variant={child.locked ? "secondary" : "primary"}
                    />
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm border-0 rounded-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-semibold mb-0">
                    <FaLock className="me-2" /> Account Lock
                  </h5>
                  <span className="badge bg-primary">
                    {children.length} children
                  </span>
                </div>

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
                        <td className="align-middle">
                          <strong>{child.name}</strong>
                        </td>
                        <td className="align-middle">
                          {child.locked ? (
                            <span className="text-danger fw-semibold">
                              <FaLock className="me-1" />
                              Locked
                            </span>
                          ) : (
                            <span className="text-success fw-semibold">
                              <FaUnlock className="me-1" />
                              Unlocked
                            </span>
                          )}
                        </td>
                        <td className="align-middle">
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Add Child Modal */}
      <Modal show={showAddChild} onHide={() => setShowAddChild(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Child Account</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddChild}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Child's Name *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter child's full name"
                value={newChild.name}
                onChange={(e) =>
                  setNewChild({ ...newChild, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={newChild.username}
                onChange={(e) =>
                  setNewChild({ ...newChild, username: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                placeholder="Set a password"
                value={newChild.password}
                onChange={(e) =>
                  setNewChild({ ...newChild, password: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Daily Screen Time Limit (hours)</Form.Label>
              <Form.Select
                value={newChild.screen_time}
                onChange={(e) =>
                  setNewChild({
                    ...newChild,
                    screen_time: parseInt(e.target.value),
                  })
                }
              >
                <option value={1}>1 hour</option>
                <option value={2}>2 hours</option>
                <option value={3}>3 hours</option>
                <option value={4}>4 hours</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddChild(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={addingChild}>
              {addingChild ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Adding...
                </>
              ) : (
                <>
                  <FaPlus className="me-1" />
                  Add Child
                </>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Container>
  );
};

export default ParentalControls;
