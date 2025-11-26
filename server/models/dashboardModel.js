const db = require("../config/db");

// ✅ Get Dashboard Stats (Last 7 Days)
exports.getDashboardStats = (callback) => {
  const sql = `
    SELECT 
      -- Active Subscriptions (created in last 7 days)
      (SELECT COUNT(*) 
       FROM subscriptions 
       WHERE is_active = 1 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS active_subscriptions_7days,

      -- New Users Signups (last 7 days)
      (SELECT COUNT(*) 
       FROM users 
       WHERE is_deleted = 0 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS new_signups_7days,

      -- Open Support Tickets (last 7 days)
      (SELECT COUNT(*) 
       FROM tickets 
       WHERE status = 'OPEN' 
       AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) AS open_tickets_7days
  `;

  db.query(sql, callback);
};
