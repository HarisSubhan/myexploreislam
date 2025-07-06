const db = require('../config/db');

const submit = (quiz_id, child_id, score, callback) => {
  const sql = `INSERT INTO quiz_submissions (quiz_id, child_id, score) VALUES (?, ?, ?)`;
  db.query(sql, [quiz_id, child_id, score], callback);
};

const getByQuiz = (quiz_id, callback) => {
  const sql = `
    SELECT qs.*, c.name AS child_name
    FROM quiz_submissions qs
    JOIN children c ON qs.child_id = c.id
    WHERE qs.quiz_id = ?
  `;
  db.query(sql, [quiz_id], callback);
};

module.exports = {
  submit,
  getByQuiz,
};
