const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const subscriptionController = require('../controllers/subscriptionController');

// Parent routes
router.post('/subscribe', verifyToken, subscriptionController.subscribe);
router.get('/me', verifyToken, subscriptionController.getMySubscription);
router.put('/cancel', verifyToken, subscriptionController.cancelSubscription);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, subscriptionController.getAllSubscriptions);

module.exports = router;
