const express = require("express");
const router = express.Router();
const childActivityController = require("../controllers/childActivityController");

// ✅ GET - All children + 7-day activity of each child
router.get("/:parentId/children-activity", childActivityController.getChildrenActivitySummary);

router.get("/:childId/all-logs", childActivityController.getAllChildActivityLogs);

module.exports = router;
