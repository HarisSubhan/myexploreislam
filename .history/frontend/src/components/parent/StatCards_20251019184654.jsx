import React from "react";
import { Card, Row, Col, Spinner } from "react-bootstrap";

const StatCards = ({ stats, loading }) => {
  const statItems = [
    {
      title: "Total Children",
      value: stats.totalChildren || 0,
      bg: "primary",
      icon: "👥",
    },
    {
      title: "Active Children",
      value: stats.active || 0,
      bg: "success",
      icon: "✅",
    },
    {
      title: "Inactive Children",
      value: stats.inactive || 0,
      bg: "secondary",
      icon: "⏸️",
    },
  ];

  if (loading) {
    return (
      <Row className="g-3">
        {statItems.map((item, index) => (
          <Col key={index} xs={12} md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="text-center p-4">
                <Spinner animation="border" variant="primary" />
                <div className="mt-2 small text-muted">Loading...</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Row className="g-3">
      {statItems.map((item, index) => (
        <Col key={index} xs={12} md={4}>
          <Card className={`shadow-sm border-0 bg-${item.bg} text-white h-100`}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="fw-bold mb-1">{item.value}</h4>
                  <p className="mb-0 small opacity-75">{item.title}</p>
                </div>
                <div className="display-4">{item.icon}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatCards;
