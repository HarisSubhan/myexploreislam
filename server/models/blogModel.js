const db = require('../config/db');

const createBlog = (data, callback) => {
  const { title, banner_image, publish_date, description } = data;
  const sql = `INSERT INTO blogs (title, banner_image, publish_date, description) VALUES (?, ?, ?, ?)`;
  db.query(sql, [title, banner_image, publish_date, description], callback);
};

module.exports = {
  createBlog,
};
