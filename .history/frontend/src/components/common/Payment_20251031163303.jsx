import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import Header from "../../../components/common/Header";
import MainFooter from "../../../components/MainFooter";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.planData;

  if (!plan) {
    return (
      <Container className="text-center mt-5">
        <h3>No plan selected!</h3>
        <Button variant="primary" onClick={() => navigate("/subscription")}>
          Go Back
        </Button>
      </Container>
    );
  }

  const handlePayment = () => {
    // This is where you’ll integrate Stripe, PayPal, etc.
    alert(`Payment successful for ${plan.plan_name} ($${plan.price})`);
    navigate("/"); // Redirect to homepage or dashboard
  };

  return (
    <>
      <Header />
      <Container className="py-5">
        <Card className="mx-auto shadow-lg" style={{ maxWidth: "500px" }}>
          <Card.Body className="text-center">
            <h3 className="mb-4">Confirm Your Payment</h3>
            <h4>{plan.plan_name}</h4>
            <p className="text-muted">Valid from {new Date(plan.start_date).toLocaleDateString()} to {new Date(plan.end_date).toLocaleDateString()}</p>
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
      <MainFooter />
    </>
  );
};

export default Payment;
