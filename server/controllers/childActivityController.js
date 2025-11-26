const ChildActivity = require("../models/childActivityModel");
const moment = require("moment");
const db = require("../config/db");

// ✅ Get all children of a parent with their 7-day day-wise activity duration
exports.getChildrenActivitySummary = (req, res) => {
  const parentId = req.params.parentId;

  ChildActivity.getChildrenByParent(parentId, (err, children) => {
    if (err) {
      console.error("Error fetching children:", err.message);
      return res.status(500).json({ message: "Database error." });
    }

    if (children.length === 0) {
      return res.status(404).json({ message: "No children found for this parent." });
    }

    let completed = 0;
    const results = [];

    children.forEach((child) => {
      ChildActivity.getChildActivityLogs(child.id, (err, logs) => {
        completed++;
        if (err) {
          console.error(`Error fetching logs for child ${child.id}:`, err.message);
          return;
        }

        // 🔹 Prepare day-wise data for last 7 days
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = moment().subtract(i, "days").format("YYYY-MM-DD");
          last7Days.push({ date, minutes: 0 });
        }

        // 🔹 Calculate active duration per day
        let lastLogin = null;

        logs.forEach((log) => {
          const logDate = moment(log.created_at).format("YYYY-MM-DD");

          if (log.action === "Logged In") {
            lastLogin = moment(log.created_at);
          } else if (log.action === "Logged Out" && lastLogin) {
            const logoutTime = moment(log.created_at);
            const diffMinutes = logoutTime.diff(lastLogin, "minutes");
            lastLogin = null;

            // Add time to correct date bucket
            const dayData = last7Days.find((d) => d.date === logDate);
            if (dayData) dayData.minutes += diffMinutes;
          }
        });

        // 🔹 Push result per child
        results.push({
          child_id: child.id,
          name: child.name,
          username: child.username,
          email: child.email,
          daily_activity: last7Days,
          total_active_minutes: last7Days.reduce((sum, d) => sum + d.minutes, 0),
          total_active_hours: (
            last7Days.reduce((sum, d) => sum + d.minutes, 0) / 60
          ).toFixed(2),
        });

        if (completed === children.length) {
          res.status(200).json({
            message: "Children activity summary fetched successfully.",
            total_children: results.length,
            data: results,
          });
        }
      });
    });
  });
};


exports.getAllChildActivityLogs = (req, res) => {
  const childId = req.params.childId;

  const query = `
    SELECT 
      id AS log_id,
      user_id AS child_id,
      action,
      metadata,
      created_at
    FROM user_activity_logs
    WHERE user_id = ? AND role = 'child'
    ORDER BY created_at DESC
  `;

  db.query(query, [childId], (err, logs) => {
    if (err) {
      console.error("Error fetching child logs:", err);
      return res.status(500).json({ message: "Database error." });
    }

    if (logs.length === 0) {
      return res.status(404).json({
        message: "No activity logs found for this child.",
        data: [],
      });
    }

    res.status(200).json({
      message: "Child activity logs fetched successfully.",
      total_logs: logs.length,
      data: logs,
    });
  });
};