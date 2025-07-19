import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "@images/logo.png";
import { LoginApi } from "../../../services/authApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await LoginApi({ email, password });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);

      const role = user.role.toLowerCase();
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "parent") navigate("/parent");
      else if (role === "child") navigate("/child");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

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
              <p className="text-muted">Platform for Young Minds</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Button
                style={{ backgroundColor: "#f1066c" }}
                type="submit"
                className="w-100 mb-3"
              >
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              <a href="/register">Create a parent account</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
