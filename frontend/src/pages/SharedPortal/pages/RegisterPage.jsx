import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { RegisterApi } from "../../../services/api";
import Header from "../../../components/common/Header";


const RegisterPage = () => {
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get subscription ID from navigation state
  const subscriptionId = location.state?.subscriptionId;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Register user with subscription ID
      const res = await RegisterApi({
        ...form,
        subscriptionId // Pass subscription ID with registration data
      });

      if (!res.token) {
        throw new Error("Registration failed");
      }

      // Save token and redirect
      localStorage.setItem("token", res.token);
      localStorage.setItem("userRole", "parent");
      
      navigate("/parent"); // Immediate redirect on success

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header/>
 <Container fluid className="vh-100">
      <Row className="h-100">
        <Col md={6} className="d-none d-md-flex bg-dark text-white p-0">
          {/* Left side with image */}
          <Image src={logo} fluid className="w-100 h-100 opacity-75" />
        </Col>

        <Col style={{backgroundColor: "#e7fcff"}} md={6} className="d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            <div className="text-center mb-4">
              <img src={logo} alt="Logo" style={{ width: 300 }} />
              <h2 className="mt-2">Explore Islam</h2>
              <p>Platform for Young Minds</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="phone"
                  placeholder="Phone Number"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
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
                disabled={loading}
              >
                {loading ? "Processing..." : "Register"}
              </Button>
            </Form>

            <div className="text-center mt-3">
              Already have an account? <a href="/login">Login here</a>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    </div>
   
  );
};

export default RegisterPage;