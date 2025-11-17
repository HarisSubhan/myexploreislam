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
  FaRedo,
} from "react-icons/fa";


const ParentNotifications = ({ parentId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent activity when component mounts or parentId changes
  useEffect(() => {
    if (parentId) {
      fetchRecentActivity();
    }
  }, [parentId]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardApi.getRecentActivity(parentId);

      // Transform API response to match our notification format
      const transformedNotifications = transformApiResponse(response.data);
      setNotifications(transformedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Transform API response to match our notification format
  const transformApiResponse = (apiData) => {
    // Assuming apiData is an array of activity items
    // Adjust this based on your actual API response structure
    if (!apiData || !Array.isArray(apiData)) {
      return [];
    }

    return apiData.map((activity, index) => ({
      id: activity.id || activity.activityId || `activity-${index}`,
      type: mapActivityType(
        activity.type || activity.activityType || activity.category
      ),
      message: generateMessage(activity),
      read: activity.read || activity.isRead || false,
      timestamp: activity.timestamp || activity.createdAt || activity.date,
      priority: activity.priority || "medium",
      // Include original data for reference
      rawData: activity,
    }));
  };

  // Map API activity types to our notification types
  const mapActivityType = (apiType) => {
    const typeMap = {
      // Alert types
      screen_time_exceeded: "alert",
      screen_time_alert: "alert",
      payment_failed: "alert",
      payment_issue: "alert",
      security_alert: "alert",
      suspicious_activity: "alert",
      blocked_content: "alert",

      // Update types
      content_filter_updated: "update",
      settings_updated: "update",
      profile_updated: "update",
      subscription_updated: "update",
      weekly_report: "update",
      monthly_report: "update",
      system_update: "update",

      // Info types
      login: "info",
      logout: "info",
      new_device: "info",
      child_activity: "info",
    };
    return typeMap[apiType] || "info";
  };

  // Generate user-friendly messages based on activity data
  const generateMessage = (activity) => {
    // Use the message from API if available, otherwise generate one
    if (activity.message || activity.description) {
      return activity.message || activity.description;
    }

    // Custom message generation based on activity type
    switch (activity.type || activity.activityType) {
      case "screen_time_exceeded":
      case "screen_time_alert":
        return `Screen time limit exceeded for ${activity.childName || "your child"}`;
      case "payment_failed":
      case "payment_issue":
        return `Payment failed for ${activity.subscriptionType || "subscription renewal"}`;
      case "content_filter_updated":
        return `Content filter settings updated for ${activity.childName || "your child"}`;
      case "weekly_report":
        return `Weekly activity report available for ${activity.childName || "your child"}`;
      case "blocked_content":
        return `Blocked inappropriate content for ${activity.childName || "your child"}`;
      case "new_device":
        return `New device detected for ${activity.childName || "your child"}`;
      default:
        return `New activity: ${activity.type || "update"}`;
    }
  };

  const markAsRead = async (id) => {
    try {
      // If you have an API endpoint to mark notifications as read, call it here
      // await markNotificationAsRead(id);

      // Update local state
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <FaExclamationTriangle className="text-danger me-2" />;
      case "update":
        return <FaInfoCircle className="text-info me-2" />;
      case "info":
        return <FaBell className="text-warning me-2" />;
      default:
        return <FaBell className="text-secondary me-2" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case "alert":
        return "danger";
      case "update":
        return "info";
      case "info":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Sort notifications by timestamp (newest first) and unread first
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Unread notifications first
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;

    // Then sort by timestamp (newest first)
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }

    return 0;
  });

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            className="me-2"
          />
          <span className="text-muted">Loading notifications...</span>
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
          <FaRedo className={loading ? "spin" : ""} />
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={fetchRecentActivity}
            >
              Retry
            </Button>
          </div>
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">
              Recent Activity{" "}
              {notifications.length > 0 && (
                <Badge bg="primary" className="ms-2">
                  {notifications.filter((n) => !n.read).length} unread
                </Badge>
              )}
            </h5>
            <div>
              {notifications.some((n) => !n.read) && (
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={markAllAsRead}
                >
                  Mark All Read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="outline-danger" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {sortedNotifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell className="text-muted mb-3" size={48} />
              <p className="text-muted">No recent activity found.</p>
              <Button variant="primary" onClick={fetchRecentActivity}>
                Refresh
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {sortedNotifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`d-flex justify-content-between align-items-center py-3 ${
                    !notification.read ? "bg-light" : ""
                  }`}
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    {getIcon(notification.type)}
                    <div className="flex-grow-1">
                      <span
                        className={!notification.read ? "fw-bold" : ""}
                        style={{
                          color: !notification.read ? "#000" : "#6c757d",
                        }}
                      >
                        {notification.message}
                      </span>
                      {notification.timestamp && (
                        <small className="text-muted d-block mt-1">
                          {new Date(notification.timestamp).toLocaleString()}
                        </small>
                      )}
                    </div>
                    <Badge
                      bg={getBadgeVariant(notification.type)}
                      className="ms-2"
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="ms-3"
                      onClick={() => markAsRead(notification.id)}
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

export default ParentNotifications;
