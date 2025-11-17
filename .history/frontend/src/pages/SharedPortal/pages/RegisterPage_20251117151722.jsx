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
  Card
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "@images/logo.png";
import { RegisterApi, createCheckoutSession } from "../../../services/api";
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
    if (location.state?.planData) {
      setSubscriptionData(location.state.planData);
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
      // Step 1: Register the user
      const registrationResponse = await RegisterApi({
        ...form,
        subscription_id: subscriptionData.id,
      });

      console.log("Registration Response:", registrationResponse);

      if (registrationResponse && registrationResponse.user) {
        // Step 2: Create Stripe checkout session
        const checkoutData = {
          plan_name: subscriptionData.plan_name,
          price: subscriptionData.price,
          max_children: subscriptionData.max_children,
          stripe_price_id: subscriptionData.stripe_price_id,
          parent_id: registrationResponse.user.id, // Use the registered user's ID
          user_email: form.email,
        };

        console.log("Creating checkout session with:", checkoutData);

        const checkoutResponse = await createCheckoutSession(checkoutData);
        
        if (checkoutResponse && checkoutResponse.url) {
          // Store user info temporarily in localStorage
          localStorage.setItem('temp_user', JSON.stringify({
            email: form.email,
            subscription_id: subscriptionData.id,
          }));
          
          // Redirect to Stripe checkout
          window.location.href = checkoutResponse.url;
        } else {
          throw new Error("Failed to create checkout session");
        }
      } else {
        throw new Error("Registration failed");
      }
    } catch (err) {
      console.error("Registration/Checkout error:", err);
      
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
            <div style={{ maxWidth: "500px", width: "100%" }}>
              <div className="text-center mb-4">
                <img src={logo} alt="Logo" style={{ width: 300 }} />
                <h2 className="mt-2">Explore Islam</h2>
                <p>Platform for Young Minds</p>
              </div>

              {/* Subscription Plan Summary */}
              {subscriptionData && (
                <Card className="mb-4 border-primary">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Selected Plan</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{subscriptionData.plan_name}</h6>
                        <small className="text-muted">
                          Max {subscriptionData.max_children} children
                        </small>
                      </div>
                      <div className="text-end">
                        <h5 className="mb-1">${subscriptionData.price}</h5>
                        <small className="text-muted">per month</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter your phone number"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Button
                  style={{ backgroundColor: "#f1066c", borderColor: "#f1066c" }}
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading || !subscriptionData}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Processing...
                    </>
                  ) : (
                    "Register & Proceed to Payment"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="text-muted mb-2">
                  You will be redirected to Stripe for secure payment
                </p>
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