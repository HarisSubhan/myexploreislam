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
    if (location.state?.subscriptionData) {
      setSubscriptionData(location.state.subscriptionData);
    } else {
      setError("Please select a subscription plan first.");
      setTimeout(() => navigate("/subscription"), 2000);
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (!form.phone_number.trim()) return "Phone number is required";
    return null;
  };

  // Stripe Checkout Session Create karo
  const createStripeCheckout = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan_name: subscriptionData.plan_name,
          price: subscriptionData.price,
          max_children: subscriptionData.max_children,
          stripe_price_id: subscriptionData.stripe_price_id,
          user_email: userData.email, // Optional: Stripe customer email ke liye
          user_name: userData.name    // Optional
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // User ko temporarily save karo (backend mein)
  const saveTemporaryUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/save-temp-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save user data');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Step 1: Pehle user data temporarily save karo backend mein
      const tempUserData = {
        ...form,
        plan_name: subscriptionData.plan_name,
        price: subscriptionData.price,
        max_children: subscriptionData.max_children,
        stripe_price_id: subscriptionData.stripe_price_id
      };

      const tempSaveResponse = await saveTemporaryUser(tempUserData);
      
      if (!tempSaveResponse.success) {
        throw new Error('Failed to save user data');
      }

      // Step 2: Stripe checkout session create karo
      const stripeResponse = await createStripeCheckout(form);

      if (stripeResponse && stripeResponse.stripeCheckoutUrl) {
        // Frontend mein bhi temporary data store karo
        localStorage.setItem("tempUserData", JSON.stringify({
          email: form.email,
          name: form.name,
          plan_name: subscriptionData.plan_name
        }));
        
        // Stripe checkout page redirect
        window.location.href = stripeResponse.stripeCheckoutUrl;
      } else {
        throw new Error("No checkout URL received");
      }

    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
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
                  <Alert variant="info" className="small">
                    <strong>Selected Plan: {subscriptionData.plan_name}</strong>
                    <br />
                    Price: ${subscriptionData.price}/month
                    <br />
                    Max Children: {subscriptionData.max_children}
                  </Alert>
                )}
                
                <p className="text-muted small">
                  You will be redirected to Stripe for secure payment processing
                </p>
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
                      minLength={6}
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
                      Preparing Payment...
                    </>
                  ) : (
                    "Register & Proceed to Payment"
                  )}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="small text-muted">
                  By registering, you agree to our Terms of Service and Privacy Policy
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