import React from "react";
import { Row, Col, Card, Table, Badge, Button } from "react-bootstrap";

const OperationalAlerts = ({ data }) => {
  const { contentPending, systemErrors, complianceAlerts } = data;

  const getSeverityVariant = (severity) => {
    const variants = {
      low: "secondary",
      medium: "warning",
      high: "danger",
      critical: "dark",
    };
    return variants[severity] || "secondary";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      low: "🔵",
      medium: "🟡",
      high: "🟠",
      critical: "🔴",
    };
    return icons[priority] || "⚪";
  };

  return (
    <Row className="g-3">
      {/* Content Pending Approval */}
      <Col xs={12} lg={4}>
        <Card className="h-100">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>📝 Content Pending</Card.Title>
            <Badge bg="warning">{contentPending.length}</Badge>
          </Card.Header>
          <Card.Body>
            {contentPending.length === 0 ? (
              <div className="text-center text-muted py-4">
                <div className="fs-1">✅</div>
                <p>All content approved</p>
              </div>
            ) : (
              contentPending.map((item) => (
                <div
                  key={item.id}
                  className="alert-item mb-3 p-2 border rounded"
                >
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <strong>{item.title}</strong>
                    <Badge bg="secondary">{item.type}</Badge>
                  </div>
                  <div className="text-muted small mb-2">By {item.author}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-warning">
                      Waiting {item.waitingDays} day
                      {item.waitingDays !== 1 ? "s" : ""}
                    </small>
                    <Button variant="outline-primary" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* System Errors */}
      <Col xs={12} lg={4}>
        <Card className="h-100">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>⚙️ System Errors</Card.Title>
            <Badge bg="danger">{systemErrors.length}</Badge>
          </Card.Header>
          <Card.Body>
            {systemErrors.length === 0 ? (
              <div className="text-center text-muted py-4">
                <div className="fs-1">✅</div>
                <p>All systems operational</p>
              </div>
            ) : (
              systemErrors.map((error) => (
                <div
                  key={error.id}
                  className="alert-item mb-3 p-2 border rounded"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold">{error.type}</span>
                    <Badge bg={getSeverityVariant(error.severity)}>
                      {error.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between text-sm">
                    <span>Count: {error.count}</span>
                    <span className="text-muted">
                      Last: {error.lastOccurred}
                    </span>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="w-100 mt-2"
                  >
                    Investigate
                  </Button>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Compliance Alerts */}
      <Col xs={12} lg={4}>
        <Card className="h-100">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <Card.Title>📋 Compliance Alerts</Card.Title>
            <Badge bg="dark">{complianceAlerts.length}</Badge>
          </Card.Header>
          <Card.Body>
            {complianceAlerts.length === 0 ? (
              <div className="text-center text-muted py-4">
                <div className="fs-1">✅</div>
                <p>No compliance issues</p>
              </div>
            ) : (
              complianceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="alert-item mb-3 p-2 border rounded"
                >
                  <div className="d-flex align-items-center mb-2">
                    <span className="me-2">
                      {getPriorityIcon(alert.priority)}
                    </span>
                    <strong className="flex-grow-1">{alert.type}</strong>
                    <Badge bg={getSeverityVariant(alert.priority)}>
                      {alert.users} user{alert.users !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {alert.age} day{alert.age !== 1 ? "s" : ""} old
                    </small>
                    <Button variant="outline-dark" size="sm">
                      Resolve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card.Body>
        </Card>
      </Col>

      {/* Alert Summary */}
      <Col xs={12}>
        <Card>
          <Card.Body>
            <Row className="text-center">
              <Col md={3}>
                <div className="alert-summary-item">
                  <div className="summary-value text-warning">
                    {contentPending.length}
                  </div>
                  <div className="summary-label">Pending Reviews</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="alert-summary-item">
                  <div className="summary-value text-danger">
                    {systemErrors.length}
                  </div>
                  <div className="summary-label">System Issues</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="alert-summary-item">
                  <div className="summary-value text-dark">
                    {complianceAlerts.length}
                  </div>
                  <div className="summary-label">Compliance Items</div>
                </div>
              </Col>
              <Col md={3}>
                <div className="alert-summary-item">
                  <div className="summary-value text-success">
                    {contentPending.length +
                      systemErrors.length +
                      complianceAlerts.length ===
                    0
                      ? "All Clear"
                      : "Action Needed"}
                  </div>
                  <div className="summary-label">Status</div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default OperationalAlerts;
