import React from "react";
import { Card, Badge } from "react-bootstrap";

const HealthMetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  variant = "primary",
  clickable = false,
  onClick,
  isPercentage = false,
}) => {
  const changePositive = change > 0;
  const changeColor = changePositive ? "success" : "danger";
  const changeIcon = changePositive ? "↗️" : "↘️";

  return (
    <Card
      className={`health-metric-card ${clickable ? "clickable" : ""}`}
      onClick={clickable ? onClick : undefined}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="metric-title">{title}</Card.Title>
          <span className="metric-icon">{icon}</span>
        </div>

        <div className="metric-value">{value}</div>

        <div className="metric-change">
          <Badge bg={changeColor} className="me-2">
            {changeIcon} {Math.abs(change)}%
          </Badge>
          <small className="text-muted">{changeLabel}</small>
        </div>

      </Card.Body>
    </Card>
  );
};

export default HealthMetricCard;
