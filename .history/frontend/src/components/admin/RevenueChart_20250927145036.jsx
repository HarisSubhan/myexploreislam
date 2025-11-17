import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const RevenueChart = ({ revenue, comparisonData }) => {
  const currentRevenue = revenue || 0;
  const previousRevenue = comparisonData?.[0]?.revenue || 0;
  const revenueChange = previousRevenue
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  // Simple bar chart implementation
  const maxRevenue = Math.max(currentRevenue, previousRevenue);
  const currentBarHeight = maxRevenue ? (currentRevenue / maxRevenue) * 100 : 0;
  const previousBarHeight = maxRevenue
    ? (previousRevenue / maxRevenue) * 100
    : 0;

  return (
    <div className="revenue-chart">
      <Row className="align-items-center mb-3">
        <Col>
          <h5 className="card-title mb-0">Revenue This Month</h5>
        </Col>
        <Col xs="auto">
          <span
            className={`revenue-change ${revenueChange >= 0 ? "text-success" : "text-danger"}`}
          >
            {revenueChange >= 0 ? "↗" : "↘"}{" "}
            {Math.abs(revenueChange).toFixed(1)}%
          </span>
        </Col>
      </Row>

      <div className="revenue-amount mb-4">
        <h2 className="text-primary">${currentRevenue.toLocaleString()}</h2>
        <small className="text-muted">MRR</small>
      </div>

      <div className="revenue-bars">
        <Row className="text-center">
          <Col>
            <div className="bar-container">
              <div
                className="bar previous-bar"
                style={{ height: `${previousBarHeight}%` }}
              ></div>
              <div className="bar-label">Last Month</div>
              <div className="bar-value">
                ${previousRevenue.toLocaleString()}
              </div>
            </div>
          </Col>
          <Col>
            <div className="bar-container">
              <div
                className="bar current-bar"
                style={{ height: `${currentBarHeight}%` }}
              ></div>
              <div className="bar-label">This Month</div>
              <div className="bar-value">
                ${currentRevenue.toLocaleString()}
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="revenue-comparison mt-3">
        <small className="text-muted">
          {revenueChange >= 0 ? "Increase" : "Decrease"} of $
          {Math.abs(currentRevenue - previousRevenue).toLocaleString()} vs last
          month
        </small>
      </div>
    </div>
  );
};

export default RevenueChart;
