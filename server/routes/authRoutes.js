const express = require('express');
const router = express.Router();

// Controller functions
const {
  register,
  login,
  setPassword,
  setEmailPassword,
  logout
} = require('../controllers/authController');

const verifyToken = require('../middleware/auth');

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/set-password', setPassword);
router.post('/set-email-password', setEmailPassword);
router.post('/logout', verifyToken, logout);

module.exports = router;
