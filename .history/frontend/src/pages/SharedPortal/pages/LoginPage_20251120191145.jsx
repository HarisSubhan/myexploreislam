// pages/Auth/LoginPage.jsx
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
import Header from "../../../components/common/Header";
import toast from "react-hot-toast";

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
      const response = await LoginApi({
        identifier: email.trim(),
        password: password.trim(),
      });

      // Check if user is active
      if (response.user?.is_active === 0) {
        throw new Error("Your account is deactivated. Please contact support.");
      }

      const token = response.token;
      const user = response.user || {};

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // Normalize user data
      const userWithId = {
        ...user,
        id: user.id || user.userId || user._id || user.email || Date.now(),
        name: user.name || user.username || user.email || "",
        email: user.email || "",
        role: (user.role || "user").toString(),
      };

      // Debug: Log the role to see what's actually coming from API
      console.log("User role from API:", userWithId.role);

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", userWithId.role);
      localStorage.setItem("user", JSON.stringify(userWithId));

      // Update context
      login({
        id: userWithId.id,
        name: userWithId.name,
        email: userWithId.email,
        role: userWithId.role,
        avatar: userWithId.avatar || null,
      });

      toast.success("Login successful");

      // Enhanced role-based redirection with better role matching
      const role = userWithId.role.toLowerCase().trim();
      
      // Define redirect paths with multiple possible role values
      const redirectPaths = {
        admin: "/admin/dashboard",
        administrator: "/admin/dashboard",
        parent: "/parent",
        child: "/child",
        kid: "/child",
        student: "/child",
        user: "/", // Default fallback
      };

      // Find the appropriate redirect path
      const redirectPath = redirectPaths[role] || "/";
      
      console.log(`Redirecting user with role '${role}' to: ${redirectPath}`);
      navigate(redirectPath);
      
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);

      // Clear storage on error
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
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
          </Col>

          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#e7fcff" }}
          >
            <div style={{ maxWidth: "400px", width: "100%" }}>
              <div className="text-center mb-4">
                <img
                  src={logo}
                  alt="Explore Islam Logo"
                  style={{ width: 300 }}
                />
                <h2 className="mt-2 mb-1">Explore Islam</h2>
                <div className="text-muted">Platform for Young Minds</div>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Control
                    placeholder="Enter Email or Username"
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
                      tabIndex={-1}
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
    </div>
  );
}

export default LoginPage;