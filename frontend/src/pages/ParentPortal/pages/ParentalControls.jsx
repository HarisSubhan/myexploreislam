import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  ProgressBar,
  Table,
} from "react-bootstrap";
import { FaLock, FaUnlock, FaClock, FaFilter } from "react-icons/fa";

const ParentalControls = () => {
  // Example children and their control settings
  const [children, setChildren] = useState([
    { id: 1, name: "Alice", screenTime: 2, locked: false },
    { id: 2, name: "Bob", screenTime: 1, locked: true },
  ]);

  const toggleLock = (id) => {
    setChildren(
      children.map((child) =>
        child.id === id ? { ...child, locked: !child.locked } : child
      )
    );
  };

  return (
    <Container fluid className="py-4">
      <h2 className="fw-bold mb-4">🛡️ Parental Controls</h2>

      <Row className="g-4">
        {/* Screen Time & Filters */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">
                <FaClock className="me-2" /> Screen Time
              </h5>
              {children.map((child) => (
                <div key={child.id} className="mb-3">
                  <strong>{child.name}</strong>
                  <ProgressBar
                    now={(child.screenTime / 4) * 100}
                    label={`${child.screenTime}h / 4h`}
                    className="mt-1"
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Lock Accounts */}
        <Col md={6}>
          <Card className="shadow-sm border-0 rounded-3">
            <Card.Body>
              <h5 className="fw-semibold mb-3">
                <FaLock className="me-2" /> Account Lock
              </h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Child</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((child) => (
                    <tr key={child.id}>
                      <td>{child.name}</td>
                      <td>
                        {child.locked ? (
                          <span className="text-danger">Locked</span>
                        ) : (
                          <span className="text-success">Unlocked</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant={child.locked ? "success" : "danger"}
                          size="sm"
                          onClick={() => toggleLock(child.id)}
                        >
                          {child.locked ? (
                            <FaUnlock className="me-1" />
                          ) : (
                            <FaLock className="me-1" />
                          )}
                          {child.locked ? "Unlock" : "Lock"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ParentalControls;
