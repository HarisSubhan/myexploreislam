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
import logo from "@images/Black_logo.png";
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

      const token = response.token;
      const user = response.user || {};

      if (!token || !user) {
        throw new Error(
          "Invalid response structure - missing token or user data"
        );
      }

      // Ensure stable 'id' field using many common names
      const id =
        user.id ||
        user.userId ||
        user._id ||
        user.user_id ||
        user.email ||
        Date.now();

      const userWithId = {
        ...user,
        id,
        name: user.name || user.username || user.email || "",
        email: user.email || "",
        role: (user.role || "user").toString(),
      };

      // Persist token + normalized user
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", userWithId.role);
      localStorage.setItem("user", JSON.stringify(userWithId));

      // Verify storage immediately
      const verifyUser = localStorage.getItem("user");
      const verifyToken = localStorage.getItem("token");

      if (!verifyUser || !verifyToken) {
        throw new Error("Failed to store authentication data");
      }

      // Update context with normalized data (include id)
      login({
        id: userWithId.id,
        name: userWithId.name,
        email: userWithId.email,
        role: userWithId.role,
        avatar: userWithId.avatar || null,
      });

      toast.success("Login successful");

      const role = (userWithId.role || "user").toLowerCase();
      const redirectPaths = {
        admin: "/admin/dashboard",
        parent: "/parent",
        child: "/child",
      };

      navigate(redirectPaths[role] || "/");
    } catch (err) {
      // try to extract backend message
      const backendMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message;
      setError(backendMessage);
      toast.error(backendMessage);

      // clear storage if partial
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
  className="d-none d-md-flex flex-column align-items-center justify-content-center text-white p-4"
  style={{ backgroundColor: "#F1066C" }}
>
  <Image
    src={logo}
    alt="Explore Islam"
    fluid
    style={{ maxWidth: "300px" }}
  />

  <p style={{color: "black"}} className="mt-3 text-center">
    An interactive learning platform for children.<br></br> Animated cartoons,
    worksheets, books and more all in one place!
  </p>
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
