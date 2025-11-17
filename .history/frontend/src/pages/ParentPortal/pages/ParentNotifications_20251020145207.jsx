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
  FaInfoCircle,
  FaExclamationTriangle,
  FaRedo,
  FaUser,
  FaClock,
  FaMoneyBill,
  FaLock,
  FaMobile,
  FaGamepad,
} from "react-icons/fa";
import { dashboardApi } from "./path-to-your-api-file"; // Adjust import path
import { useUser } from "./path-to-user-context"; // Adjust import path

const ParentNotifications = () => {
  const { parentId, user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recent activity when component mounts
  useEffect(() => {
    if (parentId) {
      fetchRecentActivity();
    } else {
      setLoading(false);
      setError("Please log in to view notifications");
    }
  }, [parentId]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching notifications for parent:", parentId);

      const response = await dashboardApi.getRecentActivity(parentId);
      console.log("API Response:", response);

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
    console.log("Original API data:", apiData);

    if (!apiData) {
      console.log("No API data received");
      return [];
    }

    // Handle different possible API response structures
    const dataArray =
      apiData.data || apiData.activities || apiData.items || apiData;

    if (!Array.isArray(dataArray)) {
      console.log("API data is not an array, received:", typeof dataArray);
      return [];
    }

    if (dataArray.length === 0) {
      console.log("API returned empty array");
      return [];
    }

    return dataArray.map((activity, index) => {
      // Use the actual data from API - no mock data
      const notification = {
        id: activity.id || activity.activityId || `activity-${index}`,
        type: mapActivityType(
          activity.type || activity.activityType || activity.category
        ),
        message: generateMessage(activity),
        childName: activity.childName || activity.child || "Your Child",
        read: activity.read || activity.isRead || false,
        timestamp:
          activity.timestamp ||
          activity.createdAt ||
          activity.date ||
          new Date().toISOString(),
        priority: activity.priority || "medium",
        // Include all original data
        rawData: activity,
      };

      console.log(`Transformed notification ${index}:`, notification);
      return notification;
    });
  };

  // Map API activity types to our notification types
  const mapActivityType = (apiType) => {
    if (!apiType) return "info";

    const typeMap = {
      screen_time_exceeded: "alert",
      screen_time_alert: "alert",
      screen_time: "alert",
      payment_failed: "alert",
      payment_issue: "alert",
      security_alert: "alert",
      suspicious_activity: "alert",
      blocked_content: "alert",
      inappropriate_content: "alert",
      alert: "alert",
      warning: "alert",

      content_filter_updated: "update",
      settings_updated: "update",
      profile_updated: "update",
      subscription_updated: "update",
      weekly_report: "update",
      monthly_report: "update",
      system_update: "update",
      new_app_installed: "update",
      update: "update",

      login: "info",
      logout: "info",
      new_device: "info",
      child_activity: "info",
      usage_report: "info",
      info: "info",
      information: "info",
    };

    return typeMap[apiType.toLowerCase()] || "info";
  };

  // Generate user-friendly messages based on actual API data
  const generateMessage = (activity) => {
    // Use the actual message from API if available
    if (activity.message) {
      return activity.message;
    }

    if (activity.description) {
      return activity.description;
    }

    // If no message is provided, generate one from available data
    const childName =
      activity.childName ||
      activity.child ||
      activity.childUsername ||
      "Your child";
    const activityType = activity.type || activity.activityType;

    switch (activityType) {
      case "screen_time_exceeded":
      case "screen_time_alert":
        return `Screen time limit exceeded for ${childName}`;
      case "payment_failed":
      case "payment_issue":
        return `Payment failed for ${childName}'s subscription`;
      case "content_filter_updated":
        return `Content filter settings updated for ${childName}`;
      case "weekly_report":
        return `Weekly activity report available for ${childName}`;
      case "blocked_content":
      case "inappropriate_content":
        return `Blocked inappropriate content for ${childName}`;
      case "new_device":
        return `New device detected for ${childName}`;
      case "new_app_installed":
        return `New app installed by ${childName}`;
      case "suspicious_activity":
        return `Suspicious activity detected for ${childName}`;
      case "login":
        return `${childName} logged in`;
      case "logout":
        return `${childName} logged out`;
      default:
        // Try to create a meaningful message from available data
        if (activityType) {
          return `${activityType.replace(/_/g, " ")} for ${childName}`;
        }
        return `New activity for ${childName}`;
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
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

  const getActivityIcon = (notification) => {
    const message = notification.message.toLowerCase();
    const type = notification.type;

    if (message.includes("screen time") || message.includes("time exceeded")) {
      return <FaClock className="text-warning me-1" />;
    } else if (
      message.includes("payment") ||
      message.includes("subscription")
    ) {
      return <FaMoneyBill className="text-danger me-1" />;
    } else if (
      message.includes("security") ||
      message.includes("suspicious") ||
      message.includes("blocked")
    ) {
      return <FaLock className="text-danger me-1" />;
    } else if (message.includes("device") || message.includes("mobile")) {
      return <FaMobile className="text-info me-1" />;
    } else if (
      message.includes("app") ||
      message.includes("game") ||
      message.includes("installed")
    ) {
      return <FaGamepad className="text-success me-1" />;
    } else if (type === "alert") {
      return <FaExclamationTriangle className="text-danger me-1" />;
    } else {
      return <FaUser className="text-primary me-1" />;
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

  // Format timestamp to relative time
  const formatTime = (timestamp) => {
    if (!timestamp) return "Recently";

    const now = new Date();
    const time = new Date(timestamp);

    // Check if timestamp is valid
    if (isNaN(time.getTime())) {
      return "Recently";
    }

    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

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
          <span className="text-muted">Loading children notifications...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <FaBell className="me-2 text-primary" /> Children Notifications
        </h2>
        <div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={fetchRecentActivity}
            disabled={loading}
            className="me-2"
          >
            <FaRedo className={loading ? "spin" : ""} />
          </Button>
          {user && (
            <Badge bg="light" text="dark" className="p-2">
              Parent: {user.name || user.email}
            </Badge>
          )}
        </div>
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

      {!parentId && (
        <Alert variant="warning" className="mb-3">
          Please log in to view your children's notifications.
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
              {notifications.length > 0 &&
                notifications.some((n) => !n.read) && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="me-2"
                    onClick={markAllAsRead}
                  >
                    <FaCheckCircle className="me-1" /> Mark All Read
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
              <p className="text-muted">No notifications from your children.</p>
              <p className="text-muted small">
                All activities will appear here once available.
              </p>
              <Button variant="primary" onClick={fetchRecentActivity}>
                Refresh
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {sortedNotifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`d-flex justify-content-between align-items-start py-3 ${
                    !notification.read
                      ? "bg-light border-start border-primary border-3"
                      : ""
                  }`}
                >
                  <div className="d-flex align-items-start flex-grow-1">
                    <div className="me-3 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-1">
                        <span
                          className={!notification.read ? "fw-bold" : ""}
                          style={{
                            color: !notification.read ? "#000" : "#6c757d",
                            fontSize: "1.1em",
                          }}
                        >
                          {notification.message}
                        </span>
                      </div>
                      <div className="d-flex align-items-center text-muted small">
                        {getActivityIcon(notification)}
                        <span className="me-3">{notification.childName}</span>
                        <FaClock className="me-1" size={12} />
                        <span>{formatTime(notification.timestamp)}</span>
                      </div>
                    </div>
                    <Badge
                      bg={getBadgeVariant(notification.type)}
                      className="ms-2 align-self-start"
                    >
                      {notification.type}
                    </Badge>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="ms-3 align-self-start"
                      onClick={() => markAsRead(notification.id)}
                    >
                      <FaCheckCircle className="me-1" /> Read
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
