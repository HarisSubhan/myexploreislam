import React from 'react';
import  ColorChanging from '../../../components/parent/ColorChangeing'
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { FaUser, FaLock, FaPalette } from "react-icons/fa";


const DefaultTheme = () => {
  const [active, setActive] = useState(null);
  
    const cards = [
      {
        key: "profile",
        title: "Profile",
        icon: <FaUser size={28} />,
        desc: "Manage your personal details",
      },
      {
        key: "password",
        title: "Password",
        icon: <FaLock size={28} />,
        desc: "Update your login credentials",
      },
    ];
  return (
    <>
      <div className="p-4">
        <h3 className="fw-bold mb-4">⚙️ Account Settings</h3>

        {!active && (
          <Row className="g-4">
            {cards.map((item) => (
              <Col md={4} key={item.key}>
                <Card
                  className="shadow-sm border-0 rounded-4 p-3 h-100 hover-card"
                  onClick={() => setActive(item.key)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex flex-column align-items-center text-center p-3">
                    <div className="mb-3 text-primary">{item.icon}</div>
                    <h5 className="fw-semibold">{item.title}</h5>
                    <p className="text-muted small">{item.desc}</p>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="mt-2"
                    >
                      Manage
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Expanded View */}
        {active === "profile" && (
          <Card className="p-4 shadow-sm border-0 rounded-4">
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
              <div className="d-flex gap-2">
                <Button variant="success">Save</Button>
                <Button variant="secondary" onClick={() => setActive(null)}>
                  Back
                </Button>
              </div>
            </Form>
          </Card>
        )}

        {active === "password" && (
          <Card className="p-4 shadow-sm border-0 rounded-4">
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
              <div className="d-flex gap-2">
                <Button variant="warning">Update</Button>
                <Button variant="secondary" onClick={() => setActive(null)}>
                  Back
                </Button>
              </div>
            </Form>
          </Card>
        )}
      </div>
      <ColorChanging />
    </>
  );
};

export default DefaultTheme;
