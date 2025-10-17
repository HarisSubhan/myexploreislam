const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { addChild, getRecentActivityLogs } = require('../controllers/parentController');

// ✅ Add Child (Parent only)
router.post('/add-child', verifyToken, addChild);

// ✅ Get recent 5 logs of all children (Parent)
router.get('/:parentId/recent-activity', getRecentActivityLogs);

module.exports = router;
