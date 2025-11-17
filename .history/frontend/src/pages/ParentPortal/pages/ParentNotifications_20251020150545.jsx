import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Button,
  Alert,
} from "react-bootstrap";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaExclamationTriangle,
  FaChartLine,
  FaBook,
  FaGraduationCap,
  FaVideo,
  FaAward,
  FaUser,
} from "react-icons/fa";
import { useUser } from "./UserContext";
import { dashboardApi } from "./dashboardApi"; // Adjust import path as needed

const ParentNotifications = () => {
  const { parentId, user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, alerts, achievements

  // Map activity types to notification categories
  const activityToNotificationMap = {
    "Logged In": {
      type: "update",
      icon: <FaUser className="text-info" />,
      color: "info",
      name: "Activity",
      priority: 4,
    },
    "Logged Out": {
      type: "update",
      icon: <FaUser className="text-secondary" />,
      color: "secondary",
      name: "Activity",
      priority: 4,
    },
    "Completed Quiz": {
      type: "achievement",
      icon: <FaChartLine className="text-success" />,
      color: "success",
      name: "Achievement",
      priority: 2,
    },
    "Started Lesson": {
      type: "update",
      icon: <FaBook className="text-primary" />,
      color: "primary",
      name: "Progress",
      priority: 3,
    },
    "Completed Lesson": {
      type: "achievement",
      icon: <FaGraduationCap className="text-success" />,
      color: "success",
      name: "Achievement",
      priority: 2,
    },
    "Watched Video": {
      type: "update",
      icon: <FaVideo className="text-info" />,
      color: "info",
      name: "Activity",
      priority: 3,
    },
    "Earned Badge": {
      type: "achievement",
      icon: <FaAward className="text-warning" />,
      color: "warning",
      name: "Milestone",
      priority: 1,
    },
  };

  // System notifications (alerts, reminders)
  const systemNotificationTypes = {
    alert: {
      icon: <FaExclamationTriangle className="text-danger" />,
      color: "danger",
      name: "Alert",
      priority: 1,
    },
    reminder: {
      icon: <FaBell className="text-warning" />,
      color: "warning",
      name: "Reminder",
      priority: 3,
    },
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent activities
        const activityResponse = await dashboardApi.getRecentActivity(parentId);
        const activities = activityResponse.data || [];

        // Convert activities to notifications
        const activityNotifications = activities.map((activity) => {
          const config = activityToNotificationMap[activity.action] || {
            type: "update",
            icon: <FaInfoCircle className="text-secondary" />,
            color: "secondary",
            name: "Activity",
            priority: 4,
          };

          return {
            id: `activity-${activity.log_id || activity.id}`,
            type: config.type,
            message: getActivityMessage(activity),
            read: false,
            timestamp: activity.created_at,
            childName: activity.child_name,
            action: activity.action,
            metadata: activity.metadata,
            source: "activity",
          };
        });

        // Add system notifications (you can fetch these from another API if needed)
        const systemNotifications = [
          {
            id: "system-1",
            type: "reminder",
            message: "Weekly progress report will be available tomorrow",
            read: true,
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            childName: null,
            action: "report_reminder",
            source: "system",
          },
          {
            id: "system-2",
            type: "alert",
            message: "Verify your email address for important updates",
            read: false,
            timestamp: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000
            ).toISOString(),
            childName: null,
            action: "email_verification",
            source: "system",
          },
        ];

        const allNotifications = [
          ...systemNotifications,
          ...activityNotifications,
        ];
        setNotifications(allNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchNotifications();
    }
  }, [parentId]);

  // Generate appropriate message based on activity
  const getActivityMessage = (activity) => {
    const metadata = parseMetadata(activity.metadata);

    switch (activity.action) {
      case "Completed Quiz":
        return `${activity.child_name} completed a quiz${metadata.score ? ` with ${metadata.score}% score` : ""}`;

      case "Started Lesson":
        return `${activity.child_name} started ${metadata.lesson || "a new lesson"}`;

      case "Completed Lesson":
        return `${activity.child_name} completed ${metadata.lesson || "a lesson"}`;

      case "Watched Video":
        return `${activity.child_name} watched educational content${metadata.duration ? ` for ${metadata.duration} minutes` : ""}`;

      case "Earned Badge":
        return `${activity.child_name} earned ${metadata.badge || "a new badge"}!`;

      case "Logged In":
        return `${activity.child_name} signed in to the platform`;

      case "Logged Out":
        return `${activity.child_name} signed out from the platform`;

      default:
        return `${activity.child_name} performed ${activity.action}`;
    }
  };

  // Parse metadata JSON
  const parseMetadata = (metadata) => {
    if (!metadata || metadata === "{}") return {};
    try {
      return JSON.parse(metadata);
    } catch {
      return {};
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // TODO: Add API call to update notification status
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    // TODO: Add API call to update all notifications
  };

  const clearAll = () => {
    setNotifications([]);
    // TODO: Add API call to delete all notifications
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    // TODO: Add API call to delete specific notification
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (filter) {
      case "unread":
        filtered = filtered.filter((n) => !n.read);
        break;
      case "alerts":
        filtered = filtered.filter((n) => n.type === "alert");
        break;
      case "achievements":
        filtered = filtered.filter((n) => n.type === "achievement");
        break;
      case "activities":
        filtered = filtered.filter((n) => n.type === "update");
        break;
      default:
        break;
    }

    // Sort by priority and timestamp (newest first)
    return filtered.sort((a, b) => {
      const configA =
        a.source === "system"
          ? systemNotificationTypes[a.type]
          : activityToNotificationMap[a.action];
      const configB =
        b.source === "system"
          ? systemNotificationTypes[b.type]
          : activityToNotificationMap[b.action];

      const priorityA = configA?.priority || 5;
      const priorityB = configB?.priority || 5;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Recently";
    }
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const getNotificationConfig = (notification) => {
    if (notification.source === "system") {
      return (
        systemNotificationTypes[notification.type] ||
        systemNotificationTypes.reminder
      );
    }

    return (
      activityToNotificationMap[notification.action] || {
        icon: <FaInfoCircle className="text-secondary" />,
        color: "secondary",
        name: "Activity",
        priority: 4,
      }
    );
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <Container fluid className="py-4">
        <h2 className="fw-bold mb-4">
          <FaBell className="me-2 text-primary" /> Notifications
        </h2>
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading notifications...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">
          <FaBell className="me-2 text-primary" /> Notifications
          {getUnreadCount() > 0 && (
            <Badge bg="danger" className="ms-2 fs-6">
              {getUnreadCount()}
            </Badge>
          )}
        </h2>

        <div className="d-flex gap-2">
          <Button
            variant="outline-success"
            size="sm"
            onClick={markAllAsRead}
            disabled={getUnreadCount() === 0}
          >
            <FaCheckCircle className="me-1" /> Mark All Read
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={clearAll}
            disabled={notifications.length === 0}
          >
            <FaTrash className="me-1" /> Clear All
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {/* Filter Buttons */}
      <div className="mb-3">
        <small className="text-muted me-2">
          <FaFilter className="me-1" /> Filter:
        </small>
        {["all", "unread", "alerts", "achievements", "activities"].map(
          (filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "primary" : "outline-primary"}
              size="sm"
              className="me-2 mb-2 text-capitalize"
              onClick={() => setFilter(filterType)}
            >
              {filterType}
              {filterType === "unread" && getUnreadCount() > 0 && (
                <Badge bg="light" text="dark" className="ms-1">
                  {getUnreadCount()}
                </Badge>
              )}
            </Button>
          )
        )}
      </div>

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell className="text-muted mb-3" size={48} />
              <h5 className="text-muted">No notifications</h5>
              <p className="text-muted">
                {filter === "all"
                  ? "You're all caught up!"
                  : `No ${filter} notifications`}
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification);
                return (
                  <ListGroup.Item
                    key={notification.id}
                    className={`p-3 ${!notification.read ? "bg-light" : ""}`}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start flex-grow-1">
                        <div className={`text-${config.color} mt-1 me-3`}>
                          {config.icon}
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-1">
                            <Badge bg={config.color} className="me-2">
                              {config.name}
                            </Badge>
                            {notification.childName && (
                              <Badge
                                bg="outline-secondary"
                                text="dark"
                                className="me-2"
                              >
                                {notification.childName}
                              </Badge>
                            )}
                            <small className="text-muted">
                              {formatTime(notification.timestamp)}
                            </small>
                          </div>

                          <p
                            className={`mb-2 ${notification.read ? "text-muted" : "fw-semibold"}`}
                            style={{
                              fontWeight: notification.read ? "normal" : "600",
                            }}
                          >
                            {notification.message}
                          </p>

                          {/* Show metadata details for activities */}
                          {notification.source === "activity" &&
                            notification.metadata && (
                              <div className="mt-1">
                                {parseMetadata(notification.metadata).score && (
                                  <Badge bg="success" className="me-2 small">
                                    Score:{" "}
                                    {parseMetadata(notification.metadata).score}
                                    %
                                  </Badge>
                                )}
                                {parseMetadata(notification.metadata)
                                  .duration && (
                                  <Badge bg="info" className="me-2 small">
                                    {
                                      parseMetadata(notification.metadata)
                                        .duration
                                    }
                                    m
                                  </Badge>
                                )}
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-1 ms-3">
                        {!notification.read && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <FaEyeSlash size={12} />
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          title="Delete notification"
                        >
                          <FaTrash size={12} />
                        </Button>
                      </div>
                    </div>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Card.Body>
      </Card>

      {/* Quick Stats */}
      {notifications.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">
            Showing {filteredNotifications.length} of {notifications.length}{" "}
            notifications • {getUnreadCount()} unread
          </small>
        </div>
      )}
    </Container>
  );
};

export default ParentNotifications;
