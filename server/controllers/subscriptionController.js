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

const updateSubscription = (req, res) => {
  const subscriptionId = req.params.id;
  const { plan_name, price, max_children, start_date, end_date } = req.body;

  Subscription.update(subscriptionId, { plan_name, price, max_children, start_date, end_date }, (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Subscription updated successfully' });
  });
};

const activeInactiveSubscription = (req, res) => {
  const subscriptionId = req.params.id;
  const { is_active } = req.body;

  Subscription.updateStatus(subscriptionId, { is_active }, (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Subscription updated successfully' });
  });
};

const getAllActiveSubscriptions = (req, res) => {
  Subscription.getAllActive((err, results) => {
    if (err) return res.status(500).json({ error: 'Error fetching subscriptions' });
    res.json(results);
  });
};


module.exports = {
  subscribe,
  getMySubscription,
  getAllSubscriptions,
  cancelSubscription,
  updateSubscription,
  activeInactiveSubscription,
  getAllActiveSubscriptions
};
