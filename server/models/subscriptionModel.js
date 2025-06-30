const db = require('../config/db');

const create = (data, callback) => {
  const sql = `
    INSERT INTO subscriptions 
    (parent_id, plan_name, price, max_children, is_active, start_date, end_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    data.parent_id,
    data.plan_name,
    data.price,
    data.max_children,
    true,
    data.start_date,
    data.end_date
  ];
  db.query(sql, values, callback);
};

const getByParentId = (parent_id, callback) => {
  db.query('SELECT * FROM subscriptions WHERE parent_id = ? ORDER BY id DESC LIMIT 1', [parent_id], callback);
};

const getAll = (callback) => {
  db.query('SELECT * FROM subscriptions ORDER BY created_at DESC', callback);
};

const cancel = (parent_id, callback) => {
  const sql = `UPDATE subscriptions SET is_active = FALSE WHERE parent_id = ?`;
  db.query(sql, [parent_id], callback);
};

module.exports = {
  create,
  getByParentId,
  getAll,
  cancel
};
