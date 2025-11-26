const express = require("express");
const router = express.Router();
const parentDashboardController = require("../controllers/parentDashboardController");

// ✅ Get Parent's Child Stats
router.get("/:parentId/children-stats", parentDashboardController.getParentChildStats);

// ✅ Get Parent's Subscription Details
router.get("/:parentId/subscription", parentDashboardController.getSubscriptionDetails);

module.exports = router;
