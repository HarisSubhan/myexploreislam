// src/pages/Frontend/Subscription/Payment.jsx
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import axios from "axios";

// ✅ Load your Stripe publishable key from .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Payment = () => {
  const location = useLocation();
  const plan = location.state?.planData;

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/payment/create-checkout-session`,
      { plan }
    );
    window.location.href = data.url;
  };

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-lg" style={{ maxWidth: "500px" }}>
        <Card.Body className="text-center">
          <h3>Confirm Payment</h3>
          <h4>{plan?.plan_name}</h4>
          <h2>${plan?.price}</h2>
          <Button onClick={handlePayment} variant="success" size="lg" className="mt-3 w-100">
            Pay Now
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Payment;
