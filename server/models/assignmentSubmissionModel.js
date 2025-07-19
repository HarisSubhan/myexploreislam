const db = require('../config/db');

const submit = (assignment_id, child_id, file_url, callback) => {
  const sql = `INSERT INTO assignment_submissions (assignment_id, child_id, file_url) VALUES (?, ?, ?)`;
  db.query(sql, [assignment_id, child_id, file_url], callback);
};

const getByAssignment = (assignment_id, callback) => {
  const sql = `
    SELECT a.*, c.name AS child_name 
    FROM assignment_submissions a
    JOIN children c ON a.child_id = c.id
    WHERE a.assignment_id = ?
  `;
  db.query(sql, [assignment_id], callback);
};

module.exports = {
  submit,
  getByAssignment,
};
