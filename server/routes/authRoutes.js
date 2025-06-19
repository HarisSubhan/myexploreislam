const express = require('express');
const router = express.Router();

// Controller functions
const {
  register,
  login,
  setPassword
} = require('../controllers/authController');

// Routes
router.post('/register', register);
router.post('/login', login);
router.post('/set-password', setPassword); // 👈 admin sets password first time

module.exports = router;
