import React from "react";
import { Row, Col, Card, ProgressBar } from "react-bootstrap";

const LearningPerformance = ({ data }) => {
  const { avgQuizScore, assignmentCompletion, courseCompletion } = data;

  const getVariant = (value) => {
    if (value >= 80) return "success";
    if (value >= 60) return "warning";
    return "danger";
  };

  return (
    <Row className="g-3">
      <Col xs={12} lg={4}>
        <Card className="metric-card">
          <Card.Body className="text-center">
            <div className="metric-icon">📊</div>
            <h3 className="metric-value">{avgQuizScore}%</h3>
            <Card.Title>Average Quiz Score</Card.Title>
            <p className="metric-description">All students, last 30 days</p>
            <ProgressBar
              variant={getVariant(avgQuizScore)}
              now={avgQuizScore}
              className="metric-progress"
            />
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} lg={4}>
        <Card className="metric-card">
          <Card.Body className="text-center">
            <div className="metric-icon">📝</div>
            <h3 className="metric-value">{assignmentCompletion}%</h3>
            <Card.Title>Assignment Completion</Card.Title>
            <p className="metric-description">% submitted vs assigned</p>
            <ProgressBar
              variant={getVariant(assignmentCompletion)}
              now={assignmentCompletion}
              className="metric-progress"
            />
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} lg={4}>
        <Card className="metric-card">
          <Card.Body className="text-center">
            <div className="metric-icon">🎓</div>
            <h3 className="metric-value">{courseCompletion}%</h3>
            <Card.Title>Course Completion Rate</Card.Title>
            <p className="metric-description">% users who finish courses</p>
            <ProgressBar
              variant={getVariant(courseCompletion)}
              now={courseCompletion}
              className="metric-progress"
            />
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12}>
        <Card>
          <Card.Body>
            <Row className="text-center">
              <Col md={4}>
                <div className="trend-item">
                  <span className="trend-up">↗</span>
                  <span className="trend-value">+5.2%</span>
                  <small className="text-muted">vs last month</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="trend-item">
                  <span className="trend-up">↗</span>
                  <span className="trend-value">+12.7%</span>
                  <small className="text-muted">assignment submissions</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="trend-item">
                  <span className="trend-up">↗</span>
                  <span className="trend-value">+8.3%</span>
                  <small className="text-muted">course starts</small>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LearningPerformance;
