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
} from "react-icons/fa";


const ParentNotifications = ({ parentId }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  useEffect(() => {
    fetchRecentActivity();
  }, [parentId]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecentActivity(parentId);

   
      const transformedNotifications = transformApiResponse(response.data);
      setNotifications(transformedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const transformApiResponse = (apiData) => {

    return apiData.map((activity, index) => ({
      id: activity.id || index + 1,
      type: mapActivityType(activity.type || activity.category),
      message: generateMessage(activity),
      read: activity.read || false,
      timestamp: activity.timestamp || activity.createdAt,
     
      ...activity,
    }));
  };


  const mapActivityType = (apiType) => {
    const typeMap = {
      screen_time_alert: "alert",
      content_filter_update: "update",
      payment_issue: "alert",
      weekly_report: "update",
      security_alert: "alert",
      system_update: "update",
      // Add more mappings as needed based on your API
    };
    return typeMap[apiType] || "update";
  };

  // Generate user-friendly messages based on activity data
  const generateMessage = (activity) => {
    // Customize this based on your API response structure
    switch (activity.type) {
      case "screen_time_alert":
        return `Screen time exceeded for ${activity.childName || "your child"}`;
      case "content_filter_update":
        return `New content filter applied for ${activity.childName || "your child"}`;
      case "payment_issue":
        return `Payment failed for ${activity.subscriptionType || "subscription renewal"}`;
      case "weekly_report":
        return `Weekly report available for ${activity.childName || "your child"}`;
      case "security_alert":
        return `Security alert: ${activity.description || "Unusual activity detected"}`;
      default:
        return (
          activity.message || activity.description || "New activity detected"
        );
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
      default:
        return <FaBell className="text-warning me-2" />;
    }
  };

  const getBadgeVariant = (type) => {
    switch (type) {
      case "alert":
        return "danger";
      case "update":
        return "info";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="me-2" />
          <span>Loading notifications...</span>
        </div>
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
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-3"
            onClick={fetchRecentActivity}
          >
            Retry
          </Button>
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
              <Button variant="outline-danger" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted text-center py-4">
              No recent activity found.
            </p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((notification) => (
                <ListGroup.Item
                  key={notification.id}
                  className="d-flex justify-content-between align-items-center py-3"
                >
                  <div className="d-flex align-items-center flex-grow-1">
                    {getIcon(notification.type)}
                    <div className="flex-grow-1">
                      <span
                        style={{
                          fontWeight: notification.read ? "normal" : "bold",
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
                      variant="success"
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
    </Container>
  );
};

export default ParentNotifications;
