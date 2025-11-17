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
} from "react-icons/fa";


const ParentNotifications = () => {
  const { parentId, user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, alerts, updates

  // Enhanced notification types with real-world scenarios
  const notificationTypes = {
    alert: {
      icon: <FaTimesCircle className="text-danger" />,
      color: "danger",
      name: "Alert",
      priority: 1,
    },
    update: {
      icon: <FaInfoCircle className="text-info" />,
      color: "info",
      name: "Update",
      priority: 3,
    },
    achievement: {
      icon: <FaCheckCircle className="text-success" />,
      color: "success",
      name: "Achievement",
      priority: 2,
    },
    reminder: {
      icon: <FaBell className="text-warning" />,
      color: "warning",
      name: "Reminder",
      priority: 4,
    },
  };

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          const mockNotifications = [
            {
              id: 1,
              type: "alert",
              message: "Screen time exceeded 2 hours for Alice",
              read: false,
              timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
              childName: "Alice",
              action: "screen_time_limit",
            },
            {
              id: 2,
              type: "achievement",
              message: "Bob completed Math Quiz with 95% score",
              read: true,
              timestamp: new Date(
                Date.now() - 2 * 60 * 60 * 1000
              ).toISOString(), // 2 hours ago
              childName: "Bob",
              action: "quiz_completed",
            },
            {
              id: 3,
              type: "alert",
              message: "Payment failed for subscription renewal",
              read: false,
              timestamp: new Date(
                Date.now() - 6 * 60 * 60 * 1000
              ).toISOString(), // 6 hours ago
              childName: null,
              action: "payment_failed",
            },
            {
              id: 4,
              type: "update",
              message: "Weekly learning report is available",
              read: true,
              timestamp: new Date(
                Date.now() - 24 * 60 * 60 * 1000
              ).toISOString(), // 1 day ago
              childName: null,
              action: "report_available",
            },
            {
              id: 5,
              type: "achievement",
              message: "Alice earned 'Math Whiz' badge",
              read: false,
              timestamp: new Date(
                Date.now() - 3 * 60 * 60 * 1000
              ).toISOString(), // 3 hours ago
              childName: "Alice",
              action: "badge_earned",
            },
            {
              id: 6,
              type: "reminder",
              message: "Parent-teacher meeting scheduled for tomorrow",
              read: false,
              timestamp: new Date(
                Date.now() - 12 * 60 * 60 * 1000
              ).toISOString(), // 12 hours ago
              childName: null,
              action: "meeting_reminder",
            },
          ];
          setNotifications(mockNotifications);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    if (parentId) {
      fetchNotifications();
    }
  }, [parentId]);

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
      case "updates":
        filtered = filtered.filter(
          (n) => n.type === "update" || n.type === "achievement"
        );
        break;
      case "reminders":
        filtered = filtered.filter((n) => n.type === "reminder");
        break;
      default:
        break;
    }

    // Sort by priority and timestamp (newest first)
    return filtered.sort((a, b) => {
      const priorityA = notificationTypes[a.type]?.priority || 5;
      const priorityB = notificationTypes[b.type]?.priority || 5;

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

      {/* Filter Buttons */}
      <div className="mb-3">
        <small className="text-muted me-2">
          <FaFilter className="me-1" /> Filter:
        </small>
        {["all", "unread", "alerts", "updates", "reminders"].map(
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
              {filteredNotifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className={`p-3 ${!notification.read ? "bg-light" : ""}`}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="d-flex align-items-start flex-grow-1">
                      <div
                        className={`text-${notificationTypes[notification.type]?.color} mt-1 me-3`}
                      >
                        {notificationTypes[notification.type]?.icon}
                      </div>

                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <Badge
                            bg={notificationTypes[notification.type]?.color}
                            className="me-2"
                          >
                            {notificationTypes[notification.type]?.name}
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
              ))}
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
