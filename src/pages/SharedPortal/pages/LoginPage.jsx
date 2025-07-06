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
import { LoginApi } from "../../../services/api";
import { useUser } from "../../../context/UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await LoginApi({ email, password });
      console.log("Full API response:", response); // Debug log

      // Handle different response structures
      const responseData = response.data || response;

      if (!responseData) {
        throw new Error("Empty response from server");
      }

      // Check for different possible response structures
      const token = responseData.token || responseData.accessToken;
      const user = responseData.user || responseData.data;

      if (!token || !user) {
        throw new Error(
          "Invalid response structure - missing token or user data"
        );
      }

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", user.role);

      // Update user context
      login({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || null,
      });

      // Redirect based on role
      const role = user.role.toLowerCase();
      const redirectPaths = {
        admin: "/admin/dashboard",
        parent: "/parent",
        child: "/child",
      };
      navigate(redirectPaths[role] || "/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials and try again."
      );
      setIsLoading(false);
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

            {error && (
              <Alert variant="danger" className="text-center">
                {error}
              </Alert>
            )}

            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
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
                style={{ backgroundColor: "#f1066c", borderColor: "#f1066c" }}
                type="submit"
                className="w-100 mb-3"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <a href="/register" className="text-decoration-none">
                Create a parent account
              </a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
