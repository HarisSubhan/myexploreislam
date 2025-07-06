// routes/childRoutes.js (ya jahan child related routes hain)
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const childController = require('../controllers/childrenControler');

router.get('/me/name', verifyToken, childController.getCurrentChildName);

module.exports = router;
