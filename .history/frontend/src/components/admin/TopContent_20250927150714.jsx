import React from "react";
import { Row, Col, Card, Table, Badge } from "react-bootstrap";

const TopContent = ({ data }) => {
  const { topContent, leastEngaged } = data;

  return (
    <Row className="g-3">
      {/* Top 5 Courses/Videos */}
      <Col xs={12} lg={6}>
        <Card className="h-100">
          <Card.Header>
            <Card.Title>🎯 Top 5 Content by Views</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Views</th>
                  <th>Completion</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <div className="content-title">
                        <span className="rank-badge">{index + 1}</span>
                        {item.title}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={item.type === "Course" ? "primary" : "success"}
                      >
                        {item.type}
                      </Badge>
                    </td>
                    <td>{item.views.toLocaleString()}</td>
                    <td>
                      <div className="completion-rate">
                        <span className="rate-value">{item.completion}%</span>
                        <div className="progress mini-progress">
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${item.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Least Engaged Content */}
      <Col xs={12} lg={6}>
        <Card className="h-100">
          <Card.Header>
            <Card.Title>⚠️ Least Engaged Content</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Views</th>
                  <th>Completion</th>
                  <th>Drop Off</th>
                </tr>
              </thead>
              <tbody>
                {leastEngaged.map((item, index) => (
                  <tr key={item.id} className="low-engagement-row">
                    <td>
                      <div className="content-title">
                        <span className="rank-badge warning">{index + 1}</span>
                        {item.title}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={item.type === "Course" ? "primary" : "success"}
                      >
                        {item.type}
                      </Badge>
                    </td>
                    <td>{item.views.toLocaleString()}</td>
                    <td>
                      <div className="completion-rate">
                        <span className="rate-value text-danger">
                          {item.completion}%
                        </span>
                        <div className="progress mini-progress">
                          <div
                            className="progress-bar bg-danger"
                            style={{ width: `${item.completion}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="danger">{100 - item.completion}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>

      {/* Content Performance Summary */}
      <Col xs={12}>
        <Card>
          <Card.Body>
            <Row className="text-center">
              <Col md={3}>
                <h5>Total Content Items</h5>
                <h3 className="text-primary">347</h3>
              </Col>
              <Col md={3}>
                <h5>Avg Completion Rate</h5>
                <h3 className="text-success">68.4%</h3>
              </Col>
              <Col md={3}>
                <h5>Avg Watch Time</h5>
                <h3 className="text-info">12.7m</h3>
              </Col>
              <Col md={3}>
                <h5>Content Engagement</h5>
                <h3 className="text-warning">7.2/10</h3>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default TopContent;
