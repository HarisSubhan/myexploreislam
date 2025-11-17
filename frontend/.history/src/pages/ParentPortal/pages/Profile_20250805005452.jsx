import React from "react";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

const Profile = () => {
  // Sample user data — replace with real data or props/context
  const user = {
    name: "Ahmed Khan",
    email: "ahmed.khan@example.com",
    role: "Child",
    joined: "January 10, 2024",
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow rounded-4 p-4 text-center">
            <div className="d-flex justify-content-center mb-3">
              <FaUserCircle size={100} color="#6c757d" />
            </div>
            <Card.Body>
              <h4 className="fw-bold mb-2">{user.name}</h4>
              <p className="text-muted mb-1">{user.email}</p>
              <p className="text-muted">Role: {user.role}</p>
              <p className="text-muted">Joined: {user.joined}</p>
              <Button variant="outline-primary" className="mt-3">
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
