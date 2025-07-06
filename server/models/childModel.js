// models/childModel.js
const db = require('../config/db');

const getChildById = (id, callback) => {
  const sql = `SELECT * FROM children WHERE id = ?`;
  db.query(sql, [id], callback);
};

module.exports = {
  getChildById
};
