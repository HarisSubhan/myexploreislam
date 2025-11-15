const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { addChild, getRecentActivityLogs, assignContentToChild, getAssignedContentForChild } = require('../controllers/parentController');

// ✅ Add Child (Parent only)
router.post('/add-child', verifyToken, addChild);

// ✅ Get recent 5 logs of all children (Parent)
router.get('/:parentId/recent-activity', getRecentActivityLogs);

router.post('/assign-content', verifyToken, assignContentToChild);

router.get('/child/:child_id/assigned-content', verifyToken, getAssignedContentForChild);

module.exports = router;
