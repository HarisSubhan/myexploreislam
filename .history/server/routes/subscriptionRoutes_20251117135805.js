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

router.post('/create-checkout-session', subscriptionController.createCheckoutSession);
router.get('/verify-payment/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (session.payment_status === 'paid') {
      // Update user subscription status in your database
      // await updateUserSubscription(session.client_reference_id, session.metadata.subscriptionId);
      
      res.json({ 
        success: true, 
        session: session,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
