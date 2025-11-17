import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const EngagementTrends = ({ data }) => {
  const { dauMauRatio, avgSessionDuration, peakUsage } = data;

  const maxUsage = Math.max(...peakUsage.map((item) => item.usage));

  return (
    <Row className="g-3">
      {/* DAU/MAU Ratio */}
      <Col xs={12} md={6} lg={4}>
        <Card className="metric-card">
          <Card.Body className="text-center">
            <div className="metric-icon">👥</div>
            <h3 className="metric-value">{(dauMauRatio * 100).toFixed(1)}%</h3>
            <Card.Title>DAU/MAU Ratio</Card.Title>
            <p className="metric-description">Daily vs Monthly Active Users</p>
            <div className="engagement-gauge">
              <div
                className="gauge-fill"
                style={{ width: `${dauMauRatio * 100}%` }}
              ></div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Average Session Duration */}
      <Col xs={12} md={6} lg={4}>
        <Card className="metric-card">
          <Card.Body className="text-center">
            <div className="metric-icon">⏱️</div>
            <h3 className="metric-value">{avgSessionDuration}m</h3>
            <Card.Title>Avg Session Duration</Card.Title>
            <p className="metric-description">Per child</p>
            <div className="duration-comparison">
              <small className="text-success">+2.3m vs last week</small>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Peak Usage Times Heatmap */}
      <Col xs={12} lg={4}>
        <Card className="heatmap-card">
          <Card.Body>
            <Card.Title>Peak Usage Times</Card.Title>
            <p className="metric-description">Hourly activity heatmap</p>
            <div className="heatmap">
              {peakUsage.map((hourData, index) => (
                <div key={index} className="heatmap-row">
                  <span className="hour-label">{hourData.hour}</span>
                  <div className="heatmap-bar-container">
                    <div
                      className="heatmap-bar"
                      style={{
                        width: `${(hourData.usage / maxUsage) * 100}%`,
                        opacity: hourData.usage / maxUsage,
                      }}
                    ></div>
                  </div>
                  <span className="usage-value">{hourData.usage}%</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* Additional Engagement Metrics */}
      <Col xs={12}>
        <Row className="g-2">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5>Total Active Users</h5>
                <h3 className="text-primary">2,847</h3>
                <small className="text-success">+124 this week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5>Weekly Sessions</h5>
                <h3 className="text-primary">18,492</h3>
                <small className="text-success">+8.7% growth</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5>Avg Sessions/User</h5>
                <h3 className="text-primary">6.5</h3>
                <small className="text-warning">-0.2 vs last week</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h5>Return Rate</h5>
                <h3 className="text-primary">84.3%</h3>
                <small className="text-success">+3.1% improvement</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default EngagementTrends;
