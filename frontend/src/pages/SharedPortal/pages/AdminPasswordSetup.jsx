import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Image, InputGroup } from "react-bootstrap";
import logo from "@images/logo.png";
import toast from "react-hot-toast";
import { setPasswordApi } from "../../../services/api";

function AdminPasswordSetup() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = "admin@exploreislam.com"; // Static email

   const handleSetPassword = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await setPasswordApi(email, password);
      toast.success("Password set successfully! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"));
    } catch (error) {
      toast.error(error.message); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Left Side (Image) */}
        <Col md={6} className="d-none d-md-flex align-items-center justify-content-center bg-dark text-white p-0 position-relative">
          <Image src={logo} alt="Explore Islam" fluid className="position-absolute w-100 h-100" style={{ objectFit: "cover", opacity: 0.75 }} />
          <div className="position-relative text-center px-4">
            <h1 className="display-5 mb-3" style={{ fontFamily: "serif" }}>فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ</h1>
          </div>
        </Col>

        {/* Right Side (Form) */}
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center mb-4">
              <img src={logo} alt="Explore Islam Logo" style={{ width: 150 }} />
              <h2 className="mt-2">Explore Islam</h2>
              <p className="text-muted">Set Admin Password</p>
            </div>

            <Form onSubmit={handleSetPassword}>
              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputGroup>
                <Form.Text className="text-muted">Password must be at least 8 characters</Form.Text>
              </Form.Group>

              <Button type="submit" style={{ backgroundColor: "#f1066c" }} className="w-100 mb-3" disabled={isSubmitting}>
                {isSubmitting ? "Setting Password..." : "Set Password"}
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