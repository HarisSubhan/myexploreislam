const db = require('../config/db');

// Create blog
const create = (blogData, callback) => {
  const { title, description, publish_date, banner } = blogData;
  const sql = `INSERT INTO blogs (title, description, publish_date, banner) VALUES (?, ?, ?, ?)`;
  db.query(sql, [title, description, publish_date, banner], callback);
};

// Get all blogs
const getAll = (callback) => {
  const sql = `SELECT * FROM blogs ORDER BY created_at DESC`;
  db.query(sql, callback);
};

// Get blog by ID
const getById = (id, callback) => {
  const sql = `SELECT * FROM blogs WHERE id = ?`;
  db.query(sql, [id], callback);
};

// Update blog
const update = (id, blogData, callback) => {
  const { title, description, publish_date, banner } = blogData;
  let sql = `UPDATE blogs SET title = ?, description = ?, publish_date = ?`;
  const values = [title, description, publish_date];

  if (banner) {
    sql += `, banner = ?`;
    values.push(banner);
  }

  sql += ` WHERE id = ?`;
  values.push(id);

  db.query(sql, values, callback);
};

// Delete blog
const remove = (id, callback) => {
  const sql = `DELETE FROM blogs WHERE id = ?`;
  db.query(sql, [id], callback);
};

// Get latest 3 blogs (public)
const getLatest = (callback) => {
  const sql = `SELECT id, title, banner, publish_date FROM blogs ORDER BY created_at DESC LIMIT 3`;
  db.query(sql, callback);
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  getLatest
};
