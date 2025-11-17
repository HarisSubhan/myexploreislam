import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./SubscriptionsPayment.css";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscriptionsPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: "$9.99",
      period: "month",
      features: ["10 Projects", "5GB Storage", "Basic Support"],
      stripePriceId: "price_basic_monthly", // Replace with your actual Stripe Price ID
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "$19.99",
      period: "month",
      features: [
        "Unlimited Projects",
        "50GB Storage",
        "Priority Support",
        "Advanced Analytics",
      ],
      stripePriceId: "price_pro_monthly", // Replace with your actual Stripe Price ID
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$49.99",
      period: "month",
      features: [
        "Unlimited Everything",
        "1TB Storage",
        "24/7 Support",
        "Custom Solutions",
      ],
      stripePriceId: "price_enterprise_monthly", // Replace with your actual Stripe Price ID
    },
  ];

  const handleSubscription = async (priceId) => {
    setLoading(true);
    setError("");

    try {
      // Create checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: priceId,
          successUrl: `${window.location.origin}/payment-success`,
          cancelUrl: `${window.location.origin}/subscriptions`,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError("Failed to create checkout session. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-header">
        <h1>Choose Your Plan</h1>
        <p>Select the subscription that works best for you</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="plans-grid">
        {subscriptionPlans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>✓ {feature}</li>
              ))}
            </ul>

            <button
              className="subscribe-button"
              onClick={() => handleSubscription(plan.stripePriceId)}
              disabled={loading}
            >
              {loading ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        ))}
      </div>

      <div className="subscriptions-info">
        <h3>What's included in all plans:</h3>
        <ul>
          <li>Secure payment processing</li>
          <li>Cancel anytime</li>
          <li>30-day money-back guarantee</li>
          <li>24/7 Customer support</li>
        </ul>
      </div>
    </div>
  );
};

export default SubscriptionsPayment;
