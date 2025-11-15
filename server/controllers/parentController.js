const db = require('../config/db');
const bcrypt = require('bcrypt');

const addChild = (req, res) => {
  const parentId = req.user.id;
  const { name, username, email, password, age } = req.body;

  if (!name || !username || !email || !password || !age) {
    return res.status(400).json({ error: "All required fields must be filled." });
  }

  // Step 1: Count existing children
  db.query("SELECT COUNT(*) AS count FROM children WHERE parent_id = ?", [parentId], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error (count)." });

    const currentCount = result[0].count;

    // Step 2: Get parent's max allowed children
    db.query("SELECT max_children FROM users WHERE id = ?", [parentId], (err, result2) => {
      if (err || result2.length === 0) {
        return res.status(404).json({ error: "Parent not found." });
      }

      const maxAllowed = result2[0].max_children;

      if (currentCount >= maxAllowed) {
        return res.status(400).json({
          error: `Child limit reached. You can only add up to ${maxAllowed} children.`,
        });
      }

      // Step 3: Check username and email uniqueness
      db.query("SELECT id FROM children WHERE username = ? OR email = ?", [username, email], (err, exist) => {
        if (err) return res.status(500).json({ error: "Database error (username/email check)." });
        if (exist.length > 0) {
          return res.status(400).json({ error: "Username or email already exists." });
        }

        // Step 4: Hash password and insert new child
        bcrypt.hash(password, 10, (hashErr, hash) => {
          if (hashErr) return res.status(500).json({ error: 'Password hashing error' });

          const sql = `
            INSERT INTO children (name, username, email, password, age, parent_id)
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          db.query(sql, [name, username, email, hash, age, parentId], (err) => {
            if (err) return res.status(500).json({ error: "Failed to add child." });

            res.status(201).json({ message: "Child added successfully." });
          });
        });
      });
    });
  });
};

// ✅ Get Recent Activity Logs (for Parent's Children)
const getRecentActivityLogs = (req, res) => {
  const parentId = req.params.parentId;

  // Step 1: Fetch all children of this parent
  const childQuery = "SELECT id, name FROM children WHERE parent_id = ? AND is_deleted = 0";

  db.query(childQuery, [parentId], (err, children) => {
    if (err) {
      console.error("Error fetching children:", err);
      return res.status(500).json({ message: "Database error while fetching children." });
    }

    if (children.length === 0) {
      return res.status(404).json({ message: "No children found for this parent." });
    }

    const childIds = children.map((child) => child.id);

    // Step 2: Fetch latest 5 logs for all children
    const logQuery = `
      SELECT 
        ual.id AS log_id,
        ual.user_id,
        c.name AS child_name,
        ual.action,
        ual.metadata,
        ual.created_at
      FROM user_activity_logs ual
      JOIN children c ON ual.user_id = c.id
      WHERE ual.user_id IN (?)
      ORDER BY ual.created_at DESC
      LIMIT 5
    `;

    db.query(logQuery, [childIds], (err, logs) => {
      if (err) {
        console.error("Error fetching logs:", err);
        return res.status(500).json({ message: "Database error while fetching logs." });
      }

      res.status(200).json({
        message: "Recent activity logs fetched successfully.",
        total_logs: logs.length,
        data: logs,
      });
    });
  });
};

// ✅ Assign video or series to a specific child
const assignContentToChild = (req, res) => {
  const parentId = req.user.id;  // Authenticated parent
  const { child_id, video_id, series_id } = req.body;

  if (!child_id || (!video_id && !series_id)) {
    return res.status(400).json({
      error: "child_id required and either video_id or series_id must be provided."
    });
  }

  const sql = `
        INSERT INTO child_assigned_content (parent_id, child_id, video_id, series_id)
        VALUES (?, ?, ?, ?)
    `;

  db.query(sql, [parentId, child_id, video_id || null, series_id || null], (err, result) => {
    if (err) {
      console.error("Error assigning content:", err);
      return res.status(500).json({ error: "Database error while assigning content." });
    }

    res.status(201).json({
      message: "Content assigned successfully!",
      id: result.insertId
    });
  });
};

// ✅ Get all assigned content for a specific child
const getAssignedContentForChild = (req, res) => {
  const child_id = req.params.child_id;

  const sql = `
        SELECT cac.id, cac.video_id, cac.series_id, v.title AS video_title, s.title AS series_title
        FROM child_assigned_content cac
        LEFT JOIN videos v ON cac.video_id = v.id
        LEFT JOIN series s ON cac.series_id = s.id
        WHERE cac.child_id = ?
        ORDER BY cac.created_at DESC
    `;

  db.query(sql, [child_id], (err, rows) => {
    if (err) {
      console.error("Error fetching assigned content:", err);
      return res.status(500).json({ error: "Database error while fetching assigned content." });
    }

    res.status(200).json({
      message: "Assigned content fetched successfully",
      total: rows.length,
      data: rows
    });
  });
};


module.exports = {
  addChild,
  getRecentActivityLogs,
  assignContentToChild,
  getAssignedContentForChild
};
