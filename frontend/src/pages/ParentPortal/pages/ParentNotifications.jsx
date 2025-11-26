import React, { useState, useEffect } from "react";
import { Container, Card, ListGroup, Badge, Alert } from "react-bootstrap";
import {
  FaBell,
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

  const activityToNotificationMap = {
    "Logged In": {
      icon: <FaUser className="text-info" />,
      color: "info",
    },
    "Logged Out": {
      icon: <FaUser className="text-secondary" />,
      color: "secondary",
    },
    "Completed Quiz": {
      icon: <FaChartLine className="text-success" />,
      color: "success", 
    },
    "Started Lesson": {
      icon: <FaBook className="text-primary" />,
      color: "primary",
    },
    "Completed Lesson": {
      icon: <FaGraduationCap className="text-success" />,
      color: "success",
    },
    "Watched Video": {
      icon: <FaVideo className="text-info" />,
      color: "info",
    },
    "Earned Badge": {
      icon: <FaAward className="text-warning" />,
      color: "warning",
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
            icon: <FaInfoCircle className="text-secondary" />,
            color: "secondary",
          };

          return {
            id: `activity-${activity.log_id || activity.id || Date.now() + Math.random()}`,
            message: getActivityMessage(activity),
            timestamp: activity.created_at,
            childName: activity.child_name,
            action: activity.action,
            metadata: activity.metadata,
            config: config
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
      <h2 className="fw-bold mb-4">
        <FaBell className="me-2 text-primary" /> Notifications
      </h2>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-5">
              <FaBell className="text-muted mb-3" size={48} />
              <h5 className="text-muted">No notifications</h5>
              <p className="text-muted">You're all caught up!</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => {
                const metadata = parseMetadata(notification.metadata);
                
                return (
                  <ListGroup.Item key={notification.id} className="p-3">
                    <div className="d-flex align-items-start">
                      <div className={`text-${notification.config.color} mt-1 me-3`}>
                        {notification.config.icon}
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-1">
                          <Badge bg={notification.config.color} className="me-2">
                            {notification.action}
                          </Badge>
                          <small className="text-muted">
                            {formatTime(notification.timestamp)}
                          </small>
                        </div>
                        
                        <p className="mb-2">
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
            {notifications.length} notifications
          </small>
        </div>
      )}
    </Container>
  );
};

export default ParentNotifications;