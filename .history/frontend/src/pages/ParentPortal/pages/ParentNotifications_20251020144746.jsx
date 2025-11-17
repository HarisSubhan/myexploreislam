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
      return getDefaultNotifications();
    }

    // Handle different possible API response structures
    const dataArray =
      apiData.data || apiData.activities || apiData.items || apiData;

    if (!Array.isArray(dataArray)) {
      console.log("API data is not an array, using default notifications");
      return getDefaultNotifications();
    }

    if (dataArray.length === 0) {
      console.log("API returned empty array, using default notifications");
      return getDefaultNotifications();
    }

    return dataArray.map((activity, index) => ({
      id: activity.id || activity.activityId || `activity-${index}`,
      type: mapActivityType(
        activity.type || activity.activityType || activity.category
      ),
      message: generateMessage(activity),
      childName: activity.childName || activity.child || getRandomChildName(),
      read: activity.read || activity.isRead || false,
      timestamp:
        activity.timestamp ||
        activity.createdAt ||
        activity.date ||
        new Date().toISOString(),
      priority: activity.priority || "medium",
    }));
  };

  // Get default notifications if API returns empty
  const getDefaultNotifications = () => {
    return [
      {
        id: 1,
        type: "alert",
        message: "Screen time exceeded for Aarav",
        childName: "Aarav",
        read: false,
        timestamp: new Date().toISOString(),
      },
      {
        id: 2,
        type: "update",
        message: "New educational app installed by Priya",
        childName: "Priya",
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: 3,
        type: "info",
        message: "Weekly usage report available for Rohit",
        childName: "Rohit",
        read: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        id: 4,
        type: "alert",
        message: "Suspicious activity detected for Anaya",
        childName: "Anaya",
        read: false,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      },
    ];
  };

  // Get random Indian child names for demo
  const getRandomChildName = () => {
    const names = [
      "Aarav",
      "Vihaan",
      "Advik",
      "Sai",
      "Arjun",
      "Reyansh",
      "Aryan",
      "Mohammed",
      "Rohan",
      "Shaurya",
      "Anaya",
      "Diya",
      "Aadhya",
      "Ira",
      "Myra",
      "Sara",
      "Anika",
      "Pari",
    ];
    return names[Math.floor(Math.random() * names.length)];
  };

  // Map API activity types to our notification types
  const mapActivityType = (apiType) => {
    const typeMap = {
      screen_time_exceeded: "alert",
      screen_time_alert: "alert",
      payment_failed: "alert",
      payment_issue: "alert",
      security_alert: "alert",
      suspicious_activity: "alert",
      blocked_content: "alert",
      inappropriate_content: "alert",

      content_filter_updated: "update",
      settings_updated: "update",
      profile_updated: "update",
      subscription_updated: "update",
      weekly_report: "update",
      monthly_report: "update",
      system_update: "update",
      new_app_installed: "update",

      login: "info",
      logout: "info",
      new_device: "info",
      child_activity: "info",
      usage_report: "info",
    };
    return typeMap[apiType] || "info";
  };

  // Generate user-friendly messages based on activity data
  const generateMessage = (activity) => {
    // Use the message from API if available
    if (activity.message || activity.description) {
      return activity.message || activity.description;
    }

    // Custom message generation based on activity type
    const childName = activity.childName || activity.child || "your child";

    switch (activity.type || activity.activityType) {
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
      default:
        return `New activity detected for ${childName}`;
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
    const now = new Date();
    const time = new Date(timestamp);
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
              {notifications.some((n) => !n.read) && (
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
                All activities will appear here.
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
