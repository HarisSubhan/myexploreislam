const db = require("../config/db");

// ✅ Get children of a parent
exports.getChildrenByParent = (parentId, callback) => {
  const sql = `
    SELECT 
      id, name, username, email, age, is_active, created_at
    FROM children
    WHERE parent_id = ? AND is_deleted = 0
  `;
  db.query(sql, [parentId], callback);
};

// ✅ Get child activity logs (last 7 days)
exports.getChildActivityLogs = (childId, callback) => {
  const sql = `
    SELECT 
      id, user_id, action, metadata, created_at
    FROM user_activity_logs
    WHERE user_id = ? 
      AND role = 'child'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY created_at ASC
  `;
  db.query(sql, [childId], callback);
};

exports.getChildActivityLogs = (childId, callback) => {
  const sql = `
    SELECT id, user_id, action, metadata, created_at
    FROM user_activity_logs
    WHERE user_id = ? 
      AND role = 'child'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    ORDER BY created_at ASC
  `;
  db.query(sql, [childId], callback);
};
