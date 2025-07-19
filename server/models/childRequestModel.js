const db = require('../config/db');

const createRequest = (parentId, requestedChildren, callback) => {
  const sql = `INSERT INTO child_requests (parent_id, requested_children) VALUES (?, ?)`;
  db.query(sql, [parentId, requestedChildren], callback);
};

const getAll = (callback) => {
  const sql = `
    SELECT cr.*, u.name AS parent_name, u.email 
    FROM child_requests cr
    JOIN users u ON cr.parent_id = u.id
    ORDER BY cr.created_at DESC
  `;
  db.query(sql, callback);
};

const updateStatus = (id, status, callback) => {
  const sql = `UPDATE child_requests SET status = ? WHERE id = ?`;
  db.query(sql, [status, id], callback);
};

const getById = (id, callback) => {
  const sql = `SELECT * FROM child_requests WHERE id = ?`;
  db.query(sql, [id], callback);
};

const incrementMaxChildren = (parentId, count, callback) => {
  const sql = `UPDATE users SET max_children = max_children + ? WHERE id = ?`;
  db.query(sql, [count, parentId], callback);
};

module.exports = {
  createRequest,
  getAll,
  updateStatus,
  getById,
  incrementMaxChildren
};
