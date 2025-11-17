import React, { useState } from "react";
import { Container, Card, ListGroup, Badge, Button } from "react-bootstrap";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

const ParentNotifications = () => {
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      message: "Screen time exceeded for Alice",
      read: false,
    },
    {
      id: 2,
      type: "update",
      message: "New content filter applied for Bob",
      read: true,
    },
    {
      id: 3,
      type: "alert",
      message: "Payment failed for subscription renewal",
      read: false,
    },
    { id: 4, type: "update", message: "Weekly report available", read: true },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Pick icon & color by type
  const getIcon = (type) => {
    if (type === "alert") return <FaTimesCircle className="text-danger me-2" />;
    if (type === "update") return <FaInfoCircle className="text-info me-2" />;
    return <FaBell className="text-warning me-2" />;
  };

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">
        <FaBell className="me-2 text-primary" /> Notifications
      </h2>

      <Card className="shadow-sm border-0 rounded-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-semibold mb-0">Alerts & Updates</h5>
            <Button variant="outline-danger" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          {notifications.length === 0 ? (
            <p className="text-muted text-center">
              No notifications available.
            </p>
          ) : (
            <ListGroup variant="flush">
              {notifications.map((n) => (
                <ListGroup.Item
                  key={n.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    {getIcon(n.type)}
                    <span
                      style={{
                        fontWeight: n.read ? "normal" : "bold",
                      }}
                    >
                      {n.message}
                    </span>
                  </div>
                  {!n.read && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => markAsRead(n.id)}
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
