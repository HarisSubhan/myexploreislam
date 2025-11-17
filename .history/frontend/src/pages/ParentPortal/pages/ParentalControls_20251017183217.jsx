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
  FaSync,
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

      // Get parent ID - you might need to adjust this based on your auth system
      const parentId =
        localStorage.getItem("userId") ||
        localStorage.getItem("parentId") ||
        "current-user-id";

      console.log("Fetching children for parent ID:", parentId);

      const response = await getChildrenByParentIdApi(parentId);
      console.log("Full API response:", response);

      // Debug: Log the entire response structure
      if (response) {
        console.log("Response type:", typeof response);
        console.log("Is array?", Array.isArray(response));
        console.log("Response keys:", Object.keys(response));
      }

      // Extract children data from different possible response structures
      let childrenData = [];

      if (Array.isArray(response)) {
        // Case 1: Response is directly an array
        childrenData = response;
      } else if (response && Array.isArray(response.data)) {
        // Case 2: Response has data array
        childrenData = response.data;
      } else if (response && Array.isArray(response.children)) {
        // Case 3: Response has children array
        childrenData = response.children;
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.children)
      ) {
        // Case 4: Response has data.children array
        childrenData = response.data.children;
      } else if (
        response &&
        response.data &&
        typeof response.data === "object"
      ) {
        // Case 5: Response data is a single object, wrap in array
        childrenData = [response.data];
      } else if (response && typeof response === "object") {
        // Case 6: Response is a single object, wrap in array
        childrenData = [response];
      } else {
        // Case 7: No children found or unexpected format
        childrenData = [];
        console.log("No children data found in response");
      }

      console.log("Extracted children data:", childrenData);

      // Transform to component structure
      const transformedChildren = childrenData.map((child, index) => {
        // Use various possible field names from your API
        const childData = {
          id: child.id || child.child_id || child.user_id || `child-${index}`,
          name:
            child.name ||
            child.username ||
            child.full_name ||
            `Child ${index + 1}`,
          screenTime:
            child.screen_time || child.screenTime || child.daily_limit || 2,
          // Assume active if not specified, locked = !is_active
          is_active:
            child.is_active !== undefined
              ? child.is_active
              : child.active !== undefined
                ? child.active
                : child.status === "active"
                  ? true
                  : child.locked !== undefined
                    ? !child.locked
                    : true,
        };

        return {
          ...childData,
          locked: !childData.is_active,
        };
      });

      console.log("Transformed children:", transformedChildren);
      setChildren(transformedChildren);

      if (transformedChildren.length === 0) {
        setError("No children accounts found. Please add children first.");
      }
    } catch (err) {
      console.error("Error in fetchChildren:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch children data";
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
      if (!child) {
        throw new Error("Child not found");
      }

      const newLockStatus = !child.locked;
      const isActive = !newLockStatus;

      console.log(
        `Updating child ${id} (${child.name}) to locked: ${newLockStatus}, is_active: ${isActive}`
      );

      // Update via API
      await updateChildStatusApi(id, isActive);

      // Update local state on success
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
      console.error("Error in toggleLock:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update child status";
      setError(errorMessage);
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
        <Button
          variant="outline-primary"
          onClick={fetchChildren}
          disabled={loading}
          className="d-flex align-items-center"
        >
          <FaSync className={loading ? "me-2 spin" : "me-2"} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert
          variant={children.length === 0 ? "warning" : "danger"}
          className="mb-4"
        >
          <FaExclamationTriangle className="me-2" />
          {error}
          {children.length === 0 && (
            <div className="mt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={fetchChildren}
                className="me-2"
              >
                Try Again
              </Button>
              <small className="text-muted">
                If the issue persists, check if you have added any children to
                your account.
              </small>
            </div>
          )}
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
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted mb-3">
                    No children accounts available
                  </p>
                  <Button variant="outline-primary" onClick={fetchChildren}>
                    Check Again
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
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold mb-0">
                  <FaLock className="me-2" /> Account Lock
                </h5>
                <span className="badge bg-primary">
                  {children.length} children
                </span>
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
              ) : (
                <div className="text-center py-5">
                  <FaLock size={48} className="text-muted mb-3" />
                  <h6 className="text-muted">No Children Accounts</h6>
                  <p className="text-muted small mb-3">
                    You haven't added any children to your account yet.
                  </p>
                  <div>
                    <Button
                      variant="primary"
                      onClick={fetchChildren}
                      className="me-2"
                    >
                      Refresh
                    </Button>
                    <Button variant="outline-primary">Add Child</Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
