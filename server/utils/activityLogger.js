const db = require('../config/db'); // <-- adjust this path if needed

const logUserActivity = (userId, action, metadata = {}) => {
  const query = "INSERT INTO user_activity_logs (user_id, action, metadata) VALUES (?, ?, ?)";
  db.query(query, [userId, action, JSON.stringify(metadata)], (err) => {
    if (err) console.error('Activity Log Error:', err);
  });
};

module.exports = logUserActivity;
