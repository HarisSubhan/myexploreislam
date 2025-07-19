const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const childController = require('../controllers/childRequestController');

// Parent creates request
router.post('/', verifyToken, childController.requestMoreChildren);

// Admin gets all requests
router.get('/', verifyToken, isAdmin, childController.getAllRequests);

// Admin updates request (approve/reject)
router.put('/:id', verifyToken, isAdmin, childController.updateRequestStatus);

module.exports = router;
