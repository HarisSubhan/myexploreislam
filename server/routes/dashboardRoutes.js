const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// ✅ Dashboard Summary API
router.get("/summary", dashboardController.getDashboardStats);

module.exports = router;
