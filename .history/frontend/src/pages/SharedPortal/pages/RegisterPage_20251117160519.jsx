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
  Spinner
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "@images/logo.png";
import { RegisterApi, CreateStripeCheckoutSession } from "../../../services/api"; // Add this API
import Header from "../../../components/common/Header";

const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    if (location.state?.subscription_id && location.state?.planData) {
      setSubscriptionData({
        id: location.state.subscription_id,
        ...location.state.planData
      });
    } else {
      setError("Please select a subscription plan first.");
      setTimeout(() => navigate("/subscription"), 2000);
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

    if (!subscriptionData) {
      setError("Please select a subscription plan first.");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Register user
      const registerResponse = await RegisterApi({
        ...form,
        subscription_id: subscriptionData.id,
      });

      console.log("Registration Response:", registerResponse);

      if (registerResponse && registerResponse.user_id) {
        // Step 2: Create Stripe Checkout Session
        const checkoutData = {
          plan_name: subscriptionData.plan_name,
          price: subscriptionData.price,
          max_children: subscriptionData.max_children,
          stripe_price_id: subscriptionData.stripe_price_id,
          parent_id: registerResponse.user_id, // Backend se milega
          user_email: form.email
        };

        console.log("Creating checkout with:", checkoutData);
        
        const checkoutResponse = await CreateStripeCheckoutSession(checkoutData);
        
        if (checkoutResponse && checkoutResponse.url) {
          // Step 3: Redirect to Stripe payment
          window.location.href = checkoutResponse.url;
        } else {
          throw new Error("Failed to create payment session");
        }
      } else {
        throw new Error("Registration failed - no user ID received");
      }
    } catch (err) {
      console.error("Registration/Payment error:", err);
      
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
                
                {subscriptionData && (
                  <div className="alert alert-info">
                    <strong>Selected Plan:</strong> {subscriptionData.plan_name}<br />
                    <strong>Price:</strong> ${subscriptionData.price}/month<br />
                    <strong>Max Children:</strong> {subscriptionData.max_children}
                  </div>
                )}
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
                    placeholder="User Name"
                    name="username"
                    value={form.username}
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
                  disabled={loading || !subscriptionData}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Processing...
                    </>
                  ) : (
                    "Register & Proceed to Payment"
                  )}
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