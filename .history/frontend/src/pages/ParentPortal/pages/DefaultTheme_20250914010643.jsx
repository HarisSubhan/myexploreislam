import React, { useState } from "react";
import ColorChanging from "../../../components/parent/ColorChangeing";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";


const DefaultTheme = () => {
  const [active, setActive] = useState(null);

  const cards = [
    {
      key: "profile",
      title: "Profile",
      icon: <FaUser size={28} />,
      desc: "Manage your personal details",
      form: (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter full name" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Button variant="success">Save</Button>
        </>
      ),
    },
    {
      key: "password",
      title: "Password",
      icon: <FaLock size={28} />,
      desc: "Update your login credentials",
      form: (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" />
          </Form.Group>
          <Button variant="warning">Update</Button>
        </>
      ),
    },
  ];

  const activeCard = cards.find((c) => c.key === active);

  return (
    <>
      <div className="p-4 account-container">
        <h3 className="fw-bold mb-4">⚙️ Account Settings</h3>

        {/* Back button */}
        {active && (
          <Button
            variant="link"
            className="mb-3 back-btn d-flex align-items-center gap-2"
            onClick={() => setActive(null)}
          >
            <FaArrowLeft /> Back
          </Button>
        )}

        {/* Overview Cards */}
        {!active && (
          <Row className="g-4">
            {cards.map((item) => (
              <Col md={6} lg={4} key={item.key}>
                <Card
                  className="account-card text-center h-100"
                  onClick={() => setActive(item.key)}
                >
                  <div className="icon-circle">{item.icon}</div>
                  <h5 className="fw-semibold mt-2">{item.title}</h5>
                  <p className="text-muted small">{item.desc}</p>
                  <Button variant="outline-primary" size="sm">
                    Manage
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Expanded Form View */}
        {activeCard && (
          <Card className="p-4 shadow-sm border-0 rounded-4 account-form animate__animated animate__fadeIn">
            <h4 className="fw-bold mb-4">
              {activeCard.icon} {activeCard.title}
            </h4>
            <Form>{activeCard.form}</Form>
          </Card>
        )}
      </div>

      {/* Theme / Color Section */}
      <ColorChanging />
    </>
  );
};

export default DefaultTheme;
