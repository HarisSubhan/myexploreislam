const Subscription = require('../models/subscriptionModel');

const subscribe = (req, res) => {
  const { plan_name, price, max_children, start_date, end_date } = req.body;
  const parent_id = req.user.id;

  const data = {
    parent_id,
    plan_name,
    price,
    max_children,
    start_date,
    end_date
  };

  Subscription.create(data, (err) => {
    if (err) return res.status(500).json({ error: 'Subscription failed' });
    res.status(201).json({ message: 'Subscription successful' });
  });
};

const getMySubscription = (req, res) => {
  const parent_id = req.user.id;

  Subscription.getByParentId(parent_id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch subscription' });
    res.json(result[0] || {});
  });
};

const getAllSubscriptions = (req, res) => {
  Subscription.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching subscriptions' });
    res.json(results);
  });
};

const cancelSubscription = (req, res) => {
  const parent_id = req.user.id;

  Subscription.cancel(parent_id, (err) => {
    if (err) return res.status(500).json({ error: 'Cancel failed' });
    res.json({ message: 'Subscription cancelled' });
  });
};

module.exports = {
  subscribe,
  getMySubscription,
  getAllSubscriptions,
  cancelSubscription
};
