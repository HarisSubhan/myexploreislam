import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const stripePromise = loadStripe("pk_test_yourPublishableKeyHere"); // from Stripe dashboard

const Payment = () => {
  const location = useLocation();
  const plan = location.state?.planData;

  const handlePayment = async () => {
    try {
      const stripe = await stripePromise;
      const { data } = await axios.post("http://localhost:5000/api/payment/create-checkout-session", {
        plan,
      });

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to start payment. Please try again.");
    }
  };

  if (!plan) {
    return (
      <Container className="text-center mt-5">
        <h3>No plan selected!</h3>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-lg" style={{ maxWidth: "500px" }}>
        <Card.Body className="text-center">
          <h3 className="mb-4">Confirm Your Payment</h3>
          <h4>{plan.plan_name}</h4>
          <p className="text-muted">
            Valid from {new Date(plan.start_date).toLocaleDateString()} to{" "}
            {new Date(plan.end_date).toLocaleDateString()}
          </p>
          <h2 className="my-3">${plan.price}</h2>
          <Button
            variant="success"
            size="lg"
            className="mt-3 w-100"
            onClick={handlePayment}
          >
            Pay Now
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Payment;
