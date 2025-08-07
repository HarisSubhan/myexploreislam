import React, { useState, useEffect } from "react";
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
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscription_id, setSubscriptionId] = useState(null);

  useEffect(() => {
    if (location.state?.subscription_id) {
      setSubscriptionId(location.state.subscription_id);
    } else {
      setError("Please select a subscription plan first.");
      setTimeout(() => navigate("/subscriptions"), 2000);
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!subscription_id) {
      setError("Please select a subscription plan first.");
      setLoading(false);
      return;
    }

    try {
      const res = await RegisterApi({
        ...form,
        subscription_id,
      });

      console.log("API Response:", res); 

      
      if (res && (res.token || res.data || res.success)) {
        
        if (res.token) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("userRole", "parent");
          localStorage.setItem("subscription_id", subscription_id);
        }

        setSuccess("Registration successful! Redirecting...");

        
        setTimeout(() => {
          navigate("/parent");
        }, 2000);
      } else {
        
        if (res && res.message) {
          setSuccess(res.message);
          setTimeout(() => {
            navigate("/login"); 
          }, 2000);
        } else {
          throw new Error("Registration completed but no token received");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);

      
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Registration failed. Please try again.";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Container fluid className="vh-100">
        <Row className="h-100">
          <Col md={6} className="d-none d-md-flex bg-dark text-white p-0">
            <Image src={logo} fluid className="w-100 h-100 opacity-75" />
          </Col>

          <Col
            style={{ backgroundColor: "#e7fcff" }}
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            <div style={{ maxWidth: "400px", width: "100%" }}>
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" style={{ width: 300 }} />
                <h2 className="mt-2">Explore Islam</h2>
                <p>Platform for Young Minds</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

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
                    type="text"
                    placeholder="Phone Number"
                    name="phone_number"
                    value={form.phone_number}
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
                  disabled={loading || !subscription_id}
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
