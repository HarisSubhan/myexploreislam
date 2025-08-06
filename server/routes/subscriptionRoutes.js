const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const subscriptionController = require('../controllers/subscriptionController');

// Parent routes
router.post('/subscribe', verifyToken, subscriptionController.subscribe);
router.get('/me', verifyToken, subscriptionController.getMySubscription);
router.get('/', verifyToken, subscriptionController.getAllSubscriptions);
router.put('/cancel', verifyToken, subscriptionController.cancelSubscription);
router.get('/all_active', verifyToken, subscriptionController.getAllActiveSubscriptions);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, subscriptionController.getAllSubscriptions);
router.put('/:id', verifyToken, isAdmin, subscriptionController.updateSubscription);
router.put('/:id/status', verifyToken, isAdmin, subscriptionController.activeInactiveSubscription);

module.exports = router;
