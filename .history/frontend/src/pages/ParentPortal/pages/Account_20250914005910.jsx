import React, { useState } from "react";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { FaUser, FaLock, FaPalette, FaArrowLeft } from "react-icons/fa";
import "./account.css"; // custom styling

const Account = () => {
  const [active, setActive] = useState(null);
  const [theme, setTheme] = useState("light");

  const cards = [
    {
      key: "profile",
      title: "Profile",
      icon: <FaUser size={30} />,
      desc: "Manage your personal details",
    },
    {
      key: "password",
      title: "Password",
      icon: <FaLock size={30} />,
      desc: "Update your login credentials",
    },
    {
      key: "theme",
      title: "Theme",
      icon: <FaPalette size={30} />,
      desc: "Customize your appearance",
    },
  ];

  // Apply theme to body class
  React.useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="account-settings-container p-4">
      <h3 className="fw-bold mb-4">⚙️ Account Settings</h3>

      {/* Back button */}
      {active && (
        <Button
          variant="link"
          className="mb-3 d-flex align-items-center gap-2 back-btn"
          onClick={() => setActive(null)}
        >
          <FaArrowLeft /> Back
        </Button>
      )}

      {/* Overview Cards */}
      {!active && (
        <Row className="g-4">
          {cards.map((item) => (
            <Col md={4} key={item.key}>
              <Card
                className="account-card text-center h-100"
                onClick={() => setActive(item.key)}
              >
                <div className="icon-wrapper">{item.icon}</div>
                <h5 className="fw-semibold">{item.title}</h5>
                <p className="text-muted small">{item.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Profile Form */}
      {active === "profile" && (
        <Card className="p-4 account-form">
          <h4 className="fw-bold mb-4">👤 Edit Profile</h4>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" placeholder="Enter full name" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Button variant="success">Save</Button>
          </Form>
        </Card>
      )}

      {/* Password Form */}
      {active === "password" && (
        <Card className="p-4 account-form">
          <h4 className="fw-bold mb-4">🔒 Change Password</h4>
          <Form>
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
          </Form>
        </Card>
      )}

      {/* Theme Form */}
      {active === "theme" && (
        <Card className="p-4 account-form">
          <h4 className="fw-bold mb-4">🎨 Theme Preferences</h4>
          <Form>
            <Row>
              <Col>
                <Form.Check
                  type="radio"
                  label="Light"
                  name="theme"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                />
              </Col>
              <Col>
                <Form.Check
                  type="radio"
                  label="Dark"
                  name="theme"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                />
              </Col>
              <Col>
                <Form.Check
                  type="radio"
                  label="System Default"
                  name="theme"
                  checked={theme === "system"}
                  onChange={() => setTheme("system")}
                />
              </Col>
            </Row>
            <Button variant="info" className="mt-3">
              Apply
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default Account;
