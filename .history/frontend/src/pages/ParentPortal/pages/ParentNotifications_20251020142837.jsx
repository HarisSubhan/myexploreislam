import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";

const ParentNotifications = ({ parentId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent activity from API
  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecentActivity(parentId);
      // Transform API response to match our notification format
      const activityData = response.data.map((activity, index) => ({
        id: activity.id || index + 1,
        type: mapActivityType(activity.type || activity.category),
        message: activity.message || activity.description,
        timestamp: activity.timestamp || activity.createdAt,
        read: activity.read || false,
        priority: activity.priority || "medium",
      }));
      setNotifications(activityData);
    } catch (err) {
      console.error("Error fetching recent activity:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Map API activity types to notification types
  const mapActivityType = (apiType) => {
    const typeMap = {
      alert: "alert",
      warning: "alert",
      error: "alert",
      info: "update",
      update: "update",
      success: "update",
      system: "update",
    };
    return typeMap[apiType] || "update";
  };

  // Fetch data on component mount and when parentId changes
  useEffect(() => {
    if (parentId) {
      fetchRecentActivity();
    }
  }, [parentId]);

  const markAsRead = async (id) => {
    try {
      // If you have an API endpoint to mark notifications as read
      // await markNotificationAsRead(parentId, id);

      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const clearAll = async () => {
    try {
      // If you have an API endpoint to clear all notifications
      // await clearAllNotifications(parentId);

      setNotifications([]);
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const getIcon = (type) => {
    const iconProps = { className: "me-2" };

    switch (type) {
      case "alert":
        return <FaTimesCircle {...iconProps} className="text-danger me-2" />;
      case "warning":
        return (
          <FaExclamationTriangle {...iconProps} className="text-warning me-2" />
        );
      case "update":
        return <FaInfoCircle {...iconProps} className="text-info me-2" />;
      default:
        return <FaBell {...iconProps} className="text-warning me-2" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const variantMap = {
      high: "danger",
      medium: "warning",
      low: "secondary",
    };

    return (
      <Badge bg={variantMap[priority] || "secondary"} className="ms-2">
        {priority}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "200px" }}
        >
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading notifications...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <FaBell className="me-2 text-primary" /> Notifications
        </h2>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={fetchRecentActivity}
          disabled={loading}
        >
          <FaSync className={loading ? "me-1 spinning" : "me-1"} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-2"
            onClick={fetchRecentActivity}
          >
            Try Again
          </Button>
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">
              Recent Activity{" "}
              {notifications.length > 0 && `(${notifications.length})`}
            </h5>
            {notifications.length > 0 && (
              <Button variant="outline-danger" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-4">
              <FaBell className="text-muted mb-3" size={48} />
              <p className="text-muted mb-0">No notifications available.</p>
              {!loading && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-2"
                  onClick={fetchRecentActivity}
                >
                  Refresh
                </Button>
              )}
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className="d-flex justify-content-between align-items-start py-3"
                >
                  <div className="d-flex align-items-start flex-grow-1">
                    {getIcon(notification.type)}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <span
                          className={
                            notification.read ? "text-muted" : "fw-bold"
                          }
                          style={{ fontSize: "1rem" }}
                        >
                          {notification.message}
                        </span>
                        {getPriorityBadge(notification.priority)}
                      </div>
                      {notification.timestamp && (
                        <small className="text-muted d-block mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </small>
                      )}
                    </div>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => markAsRead(notification.id)}
                      className="ms-3"
                    >
                      <FaCheckCircle className="me-1" /> Mark Read
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        .spinning {
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

export default ParentNotifications;
