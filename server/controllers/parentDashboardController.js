const ParentDashboard = require("../models/parentDashboardModel");

// ✅ Get Child Stats for a Parent
exports.getParentChildStats = (req, res) => {
  const parentId = req.params.parentId;

  if (!parentId) {
    return res.status(400).json({ message: "Parent ID is required." });
  }

  ParentDashboard.getParentChildStats(parentId, (err, results) => {
    if (err) {
      console.error("Error fetching parent child stats:", err.message);
      return res
        .status(500)
        .json({ message: "Database error while fetching stats." });
    }

    return res.status(200).json({
      message: "Parent child stats fetched successfully.",
      data: results[0],
    });
  });
};

// ✅ Get Subscription Details for a Parent
exports.getSubscriptionDetails = async (req, res) => {
  try {
    const parentId = req.params.parentId || req.user?.id; // token-based later

    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required" });
    }

    // ✅ Make sure function is imported correctly
    const subscription = await ParentDashboard.getParentSubscription(parentId);

    if (!subscription) {
      return res
        .status(404)
        .json({ message: "No subscription found for this parent" });
    }

    return res.status(200).json({
      message: "Subscription details fetched successfully",
      data: subscription,
    });
  } catch (error) {
    console.error("Error fetching parent subscription:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
