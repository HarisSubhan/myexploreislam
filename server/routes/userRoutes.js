const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const userController = require('../controllers/userController');

router.get('/me/name', verifyToken, userController.getCurrentUserName);

module.exports = router;