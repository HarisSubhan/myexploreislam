const Dashboard = require("../models/dashboardModel");

// ✅ Get Admin Dashboard Stats (7 days)
exports.getDashboardStats = (req, res) => {
  Dashboard.getDashboardStats((err, results) => {
    if (err) {
      console.error("Error fetching dashboard stats:", err.message);
      return res.status(500).json({ message: "Database error while fetching dashboard stats." });
    }

    res.status(200).json({
      message: "Dashboard stats fetched successfully.",
      data: results[0], // single row result
    });
  });
};
