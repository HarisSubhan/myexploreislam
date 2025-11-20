import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Badge, Button, Alert } from "react-bootstrap";
import {
  FaBell,
  FaCheckCircle,
  FaTrash,
  FaEyeSlash,
  FaFilter,
  FaUser,
  FaChartLine,
  FaBook,
  FaGraduationCap,
  FaVideo,
  FaAward,
  FaInfoCircle,
} from "react-icons/fa";
import { useUser } from "../../../context/UserContext";
import { dashboardApi } from "../../../services/childActivity"; 

const ParentNotifications = () => {
  const { parentId } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const activityToNotificationMap = {
    "Logged In": {
      type: "update",
      icon: <FaUser className="text-info" />,
      color: "info",
      name: "Activity",
    },
    "Logged Out": {
      type: "update", 
      icon: <FaUser className="text-secondary" />,
      color: "secondary",
      name: "Activity",
    },
    "Completed Quiz": {
      type: "achievement",
      icon: <FaChartLine className="text-success" />,
      color: "success", 
      name: "Achievement",
    },
    "Started Lesson": {
      type: "update",
      icon: <FaBook className="text-primary" />,
      color: "primary",
      name: "Progress",
    },
    "Completed Lesson": {
      type: "achievement",
      icon: <FaGraduationCap className="text-success" />,
      color: "success",
      name: "Achievement", 
    },
    "Watched Video": {
      type: "update",
      icon: <FaVideo className="text-info" />,
      color: "info",
      name: "Activity",
    },
    "Earned Badge": {
      type: "achievement", 
      icon: <FaAward className="text-warning" />,
      color: "warning",
      name: "Milestone",
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const activityResponse = await dashboardApi.getRecentActivity(parentId);
        
        let activities = [];
        
        if (activityResponse?.data) {
          if (Array.isArray(activityResponse.data)) {
            activities = activityResponse.data;
          } else if (activityResponse.data.activities && Array.isArray(activityResponse.data.activities)) {
            activities = activityResponse.data.activities;
          } else if (activityResponse.data.data && Array.isArray(activityResponse.data.data)) {
            activities = activityResponse.data.data;
          } else if (activityResponse.data.results && Array.isArray(activityResponse.data.results)) {
            activities = activityResponse.data.results;
          } else {
            const possibleArrays = Object.values(activityResponse.data).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              activities = possibleArrays[0];
            }
          }
        }

        const activityNotifications = activities.map(activity => {
          const config = activityToNotificationMap[activity.action] || {
            type: "update",
            icon: <FaInfoCircle className="text-secondary" />,
            color: "secondary",
            name: "Activity",
          };

          return {
            id: `activity-${activity.log_id || activity.id || Date.now() + Math.random()}`,
            type: config.type,
            message: getActivityMessage(activity),
            read: false,
            timestamp: activity.created_at,
            childName: activity.child_name,
            action: activity.action,
            metadata: activity.metadata,
            source: "activity"
          };
        });

        setNotifications(activityNotifications);
        
      } catch (error) {
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchNotifications();
    }
  }, [parentId]);

  const getActivityMessage = (activity) => {
    const metadata = parseMetadata(activity.metadata);
    
    switch (activity.action) {
      case "Completed Quiz":
        return `${activity.child_name} completed a quiz${metadata.score ? ` with ${metadata.score}% score` : ''}`;
      case "Started Lesson":
        return `${activity.child_name} started ${metadata.lesson || 'a new lesson'}`;
      case "Completed Lesson":
        return `${activity.child_name} completed ${metadata.lesson || 'a lesson'}`;
      case "Watched Video":
        return `${activity.child_name} watched educational content${metadata.duration ? ` for ${metadata.duration} minutes` : ''}`;
      case "Earned Badge":
        return `${activity.child_name} earned ${metadata.badge || 'a new badge'}!`;
      case "Logged In":
        return `${activity.child_name} signed in to the platform`;
      case "Logged Out":
        return `${activity.child_name} signed out from the platform`;
      default:
        return `${activity.child_name} performed ${activity.action}`;
    }
  };

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
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (filter) {
      case "unread":
        filtered = filtered.filter(n => !n.read);
        break;
      case "achievements":
        filtered = filtered.filter(n => n.type === "achievement");
        break;
      case "activities":
        filtered = filtered.filter(n => n.type === "update");
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
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
    return notifications.filter(n => !n.read).length;
  };

  const getNotificationConfig = (notification) => {
    return activityToNotificationMap[notification.action] || {
      icon: <FaInfoCircle className="text-secondary" />,
      color: "secondary",
      name: "Activity",
    };
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

      <div className="mb-3">
        <small className="text-muted me-2">
          <FaFilter className="me-1" /> Filter:
        </small>
        {["all", "unread", "achievements", "activities"].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "primary" : "outline-primary"}
            size="sm"
            className="me-2 mb-2 text-capitalize"
            onClick={() => setFilter(filterType)}
          >
            {filterType}
          </Button>
        ))}
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
                  : `No ${filter} notifications`
                }
              </p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {filteredNotifications.map((notification) => {
                const config = getNotificationConfig(notification);
                const metadata = parseMetadata(notification.metadata);
                
                return (
                  <ListGroup.Item
                    key={notification.id}
                    className={`p-3 ${!notification.read ? 'bg-light' : ''}`}
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
                              <Badge bg="outline-secondary" text="dark" className="me-2">
                                {notification.childName}
                              </Badge>
                            )}
                            <small className="text-muted">
                              {formatTime(notification.timestamp)}
                            </small>
                          </div>
                          
                          <p className={`mb-2 ${notification.read ? 'text-muted' : 'fw-semibold'}`}>
                            {notification.message}
                          </p>

                          {metadata.score && (
                            <Badge bg="success" className="me-2 small">
                              Score: {metadata.score}%
                            </Badge>
                          )}
                          {metadata.duration && (
                            <Badge bg="info" className="me-2 small">
                              {metadata.duration}m
                            </Badge>
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

      {notifications.length > 0 && (
        <div className="mt-3">
          <small className="text-muted">
            Showing {filteredNotifications.length} of {notifications.length} notifications • 
            {" "}{getUnreadCount()} unread
          </small>
        </div>
      )}
    </Container>
  );
};

export default ParentNotifications;