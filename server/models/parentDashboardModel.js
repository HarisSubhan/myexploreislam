const db = require("../config/db");

// ✅ Get Parent's Child Counts
const getParentChildStats = (parentId, callback) => {
  const sql = `
    SELECT
      COUNT(*) AS total_children,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active_children,
      SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactive_children
    FROM children
    WHERE parent_id = ? AND is_deleted = 0
  `;

  db.query(sql, [parentId], callback);
};

// ✅ Get Parent's Subscription Details
const getParentSubscription = (parentId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT s.*
      FROM subscriptions s
      JOIN users u ON u.subscription_id = s.id
      WHERE u.id = ? AND u.is_deleted = 0
    `;
    db.query(query, [parentId], (err, result) => {
      if (err) return reject(err);
      resolve(result[0] || null);
    });
  });
};

// ✅ Export All Functions Properly
module.exports = {
  getParentChildStats,
  getParentSubscription,
};
