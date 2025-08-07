const db = require('../config/db'); // <-- adjust this path if needed

const logUserActivity = (userId, action, metadata = {}, role) => {
  const query = "INSERT INTO user_activity_logs (user_id, action, metadata, role) VALUES (?, ?, ?, ?)";
  db.query(query, [userId, action, JSON.stringify(metadata), role], (err) => {
    if (err) console.error('Activity Log Error:', err);
  });
};

module.exports = logUserActivity;
