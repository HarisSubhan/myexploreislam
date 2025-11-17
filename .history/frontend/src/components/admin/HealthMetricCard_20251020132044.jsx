import React from "react";
import { Card, Badge } from "react-bootstrap";

const HealthMetricCard = ({
  title,
  value,
  change,
  icon,
  
  clickable = false,
  onClick,
  
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

        

      </Card.Body>
    </Card>
  );
};

export default HealthMetricCard;
