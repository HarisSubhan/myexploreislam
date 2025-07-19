import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Image,
  InputGroup,
} from "react-bootstrap";
import logo from "@images/logo.png";

const email = "admin@example.com";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function AdminPasswordSetup() {
  const [passwordSet, setPasswordSet] = useState(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/auth/check-password-set`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => setPasswordSet(data.passwordSet))
      .catch(() => {
        setError("Failed to connect to server.");
        setPasswordSet(false);
      });
  }, []);

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password set successfully! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Server error. Try again later.");
    }
  };

  if (passwordSet === null) return <p>Loading...</p>;
  if (passwordSet === true) return <p>Password already set. Please login.</p>;

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center bg-dark text-white p-0 position-relative"
        >
          <Image
            src={logo}
            alt="Explore Islam"
            fluid
            className="position-absolute w-100 h-100"
            style={{ objectFit: "cover", opacity: 0.75 }}
          />
          <div className="position-relative text-center px-4">
            <h1 className="display-5 mb-3" style={{ fontFamily: "serif" }}>
              فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ
            </h1>
          </div>
        </Col>

        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center mb-4">
              <img src={logo} alt="Explore Islam Logo" style={{ width: 150 }} />
              <h2 className="mt-2">Explore Islam</h2>
              <p className="text-muted">Set Admin Password</p>
            </div>

            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSetPassword}>
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                style={{ backgroundColor: "#f1066c" }}
                type="submit"
                className="w-100 mb-3"
              >
                Set Password
              </Button>
            </Form>

            <div className="text-center mt-3">
              <a href="/login">Already have a password? Login</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPasswordSetup;
