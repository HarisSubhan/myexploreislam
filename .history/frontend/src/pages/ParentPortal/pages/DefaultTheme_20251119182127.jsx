import React, { useState, useContext } from "react";
import ColorChanging from "../../../components/parent/ColorChangeing";
import { Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import { UserContext } from "../../../";
import { setPasswordApi } from "../../../services/api";

const DefaultTheme = () => {
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Get email from context
  const { user } = useContext(UserContext);
  const userEmail = user?.email || "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Use email from context and password from form
      await setPasswordApi(userEmail, formData.password);
      setMessage({ 
        type: 'success', 
        text: 'Password updated successfully!' 
      });
      setFormData(prev => ({ ...prev, password: "" }));
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      key: "profile",
      title: "Profile",
      icon: <FaUser size={28} />,
      desc: "Manage your personal details",
      form: (
        <Form onSubmit={handleSubmit}>
          {message.text && (
            <Alert variant={message.type} className="mb-3">
              {message.text}
            </Alert>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              value={userEmail}
              readOnly
              disabled
              className="bg-light"
            />
            <Form.Text className="text-muted">
              Your registered email address
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Change Password</Form.Label>
            <Form.Control 
              type="password" 
              name="password"
              placeholder="Enter new password" 
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
            />
            <Form.Text className="text-muted">
              Password must be at least 6 characters long
            </Form.Text>
          </Form.Group>
          
          <Button 
            variant="success" 
            type="submit"
            disabled={loading || !formData.password}
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </Form>
      ),
    },
  ];

  const activeCard = cards.find((c) => c.key === active);

  return (
    <>
      {/* Inline CSS for the component */}
      <style>{`
        .account-container { min-height: 10vh; }
        .account-card {
          border: none;
          border-radius: 18px;
          padding: 30px 20px;
          background: var(--bs-light);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .account-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        .icon-circle {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0d6efd, #20c997);
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
        }
        .back-btn {
          font-weight: 500;
          text-decoration: none !important;
          color: var(--bs-primary);
          transition: all 0.2s ease;
        }
        .back-btn:hover {
          color: #0a58ca;
          transform: translateX(-4px);
        }
        .account-form {
          border-radius: 18px;
        }
      `}</style>

      <div className="p-4 account-container">
        <h3 className="fw-bold mb-4">⚙️ Account Settings</h3>

        {/* Back button */}
        {active && (
          <Button
            variant="link"
            className="mb-3 back-btn d-flex align-items-center gap-2"
            onClick={() => {
              setActive(null);
              setMessage({ type: '', text: '' });
              setFormData({ email: "", password: "" });
            }}
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
            {activeCard.form}
          </Card>
        )}
      </div>

      {/* Theme / Color Section */}
      <ColorChanging />
    </>
  );
};

export default DefaultTheme;