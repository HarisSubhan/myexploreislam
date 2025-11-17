const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const Subscription = require("../models/subscriptionModel");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("Webhook signature error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Payment completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const data = {
        parent_id: session.metadata.parent_id,
        plan_name: session.metadata.plan_name,
        price: session.metadata.price,
        max_children: session.metadata.max_children,
        is_active: true,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      Subscription.create(data, (err) => {
        if (err) console.log("DB save failed:", err);
        else console.log("Subscription saved successfully!");
      });
    }

    res.json({ received: true });
  }
);

module.exports = router;
