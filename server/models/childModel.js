// models/childModel.js
const db = require('../config/db');

const getChildById = (id, callback) => {
  const sql = `SELECT * FROM children WHERE id = ?`;
  db.query(sql, [id], callback);
};

const updateColor = (childId, parentId, color, callback) => {
  const sql = `UPDATE children SET color = ? WHERE id = ? AND parent_id = ?`;
  db.query(sql, [color, childId, parentId], callback);
};


module.exports = {
  getChildById,
  updateColor
};
