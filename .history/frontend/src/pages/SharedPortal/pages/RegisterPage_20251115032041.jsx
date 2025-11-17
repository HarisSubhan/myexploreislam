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
import { RegisterApi, createStripeCheckoutSession } from "../../../services/api";
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
      console.log("Received subscription data:", location.state.planData);
      setSubscriptionData({
        id: location.state.subscription_id,
        ...location.state.planData
      });
    } else {
      setError("Please select a subscription plan first.");
      setTimeout(() => navigate("/subscription"), 2000);
    }
  }, [location, navigate]);

  // ✅ Stripe price ID mapping
  const getStripePriceId = (planName) => {
    const priceMap = {
      'test': 'price_1STUv1DttKoZh8aWsX7T1BWm', // ✅ Your stripe_price_id
      'Basic Plan': 'price_1QabcXYZ123',
      'Premium Plan': 'price_1QabcXYZ124'
    };
    return priceMap[planName] || null;
  };

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
    // Step 1: User Registration
    console.log("Starting registration process...");
    const registrationResponse = await RegisterApi({
      ...form,
      subscription_id: subscriptionData.id,
    });

    console.log("Registration Response:", registrationResponse);

    // ✅ Get stripe_price_id from mapping
    const stripePriceId = subscriptionData.stripe_price_id || getStripePriceId(subscriptionData.plan_name);
    
    if (!stripePriceId) {
      throw new Error(`Payment not configured for plan: ${subscriptionData.plan_name}`);
    }

    // Step 2: Create Stripe Checkout Session
    const checkoutData = {
      plan_name: subscriptionData.plan_name,
      price: parseFloat(subscriptionData.price),
      max_children: parseInt(subscriptionData.max_children),
      stripe_price_id: stripePriceId,
      subscription_id: subscriptionData.id,
      user_email: form.email,
      user_name: form.name
    };

    console.log("Creating checkout session with data:", checkoutData);
    
    const checkoutResponse = await createStripeCheckoutSession(checkoutData);
    
    if (checkoutResponse.success && checkoutResponse.stripeCheckoutUrl) {
      // Store basic user data temporarily for after payment
      localStorage.setItem('tempUserData', JSON.stringify({
        email: form.email,
        name: form.name,
        subscription_id: subscriptionData.id
      }));

      console.log("Redirecting to Stripe checkout...");
      // Redirect to Stripe payment
      window.location.href = checkoutResponse.stripeCheckoutUrl;
    } else {
      throw new Error(checkoutResponse.error || "Failed to create payment session");
    }

  } catch (err) {
    console.error("Registration/Payment error:", err);
    
    // ✅ User-friendly error messages
    let errorMessage = err.message || "Registration failed. Please try again.";
    
    if (err.message.includes('500') || err.message.includes('Internal Server')) {
      errorMessage = "Our payment system is currently undergoing maintenance. Please try again in a few minutes.";
    }
    
    if (err.message.includes('Stripe')) {
      errorMessage = "Payment service temporarily unavailable. Please contact support.";
    }
    
    setError(errorMessage);
    setLoading(false);
  }
};

  // ✅ Check if stripe_price_id is available
  const stripePriceId = subscriptionData?.stripe_price_id || getStripePriceId(subscriptionData?.plan_name);

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
                  <div className={`alert ${stripePriceId ? 'alert-info' : 'alert-warning'}`}>
                    <strong>Selected Plan:</strong> {subscriptionData.plan_name}<br/>
                    <strong>Price:</strong> ${subscriptionData.price}/month<br/>
                    <strong>Max Children:</strong> {subscriptionData.max_children}
                    <div className={`mt-1 ${stripePriceId ? 'text-success' : 'text-danger'}`}>
                      {stripePriceId ? '✅ Payment ready' : '⚠️ Payment configuration needed'}
                    </div>
                  </div>
                )}
                
                <p className="text-muted">
                  You will be redirected to Stripe for payment after registration
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
                    autoComplete="name"
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
                    autoComplete="username"
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
                    autoComplete="tel"
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
                    autoComplete="email"
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
                      autoComplete="new-password"
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
                  disabled={loading || !subscriptionData || !stripePriceId}
                >
                  {loading ? "Processing..." : "Register & Proceed to Payment"}
                </Button>
              </Form>

              {!stripePriceId && (
                <Alert variant="warning" className="text-center">
                  <strong>Payment Configuration Required</strong><br/>
                  Please contact support to enable payments for this plan.
                </Alert>
              )}

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