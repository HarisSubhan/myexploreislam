const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const subscriptionController = require('../controllers/subscriptionController');

// Parent routes
router.get('/all_active', subscriptionController.getAllActiveSubscriptions);
router.post('/subscribe', verifyToken, subscriptionController.subscribe);
router.get('/me', verifyToken, subscriptionController.getMySubscription);
router.get('/', verifyToken, subscriptionController.getAllSubscriptions);
router.put('/cancel', verifyToken, subscriptionController.cancelSubscription);


// Admin routes
router.get('/admin/all', verifyToken, isAdmin, subscriptionController.getAllSubscriptions);
router.put('/:id', verifyToken, isAdmin, subscriptionController.updateSubscription);
router.put('/:id/status', verifyToken, isAdmin, subscriptionController.activeInactiveSubscription);

module.exports = router;
