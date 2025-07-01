const db = require('../config/db');

// Create Quiz
const createQuiz = (quizData, callback) => {
  const { title, description, category } = quizData;
  const sql = `INSERT INTO quizzes (title, description, category) VALUES (?, ?, ?)`;
  db.query(sql, [title, description, category], callback);
};

// Add Quiz Questions
const addQuestions = (quizId, questions, callback) => {
  const values = questions.map(q => [
    quizId,
    q.question,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.correct_option
  ]);

  const sql = `
    INSERT INTO quiz_questions 
    (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
    VALUES ?
  `;
  db.query(sql, [values], callback);
};

// Get All Quizzes
const getAllQuizzes = (callback) => {
  const sql = `SELECT * FROM quizzes ORDER BY created_at DESC`;
  db.query(sql, callback);
};

// Get Single Quiz with Questions
const getQuizById = (id, callback) => {
  const quizSql = `SELECT * FROM quizzes WHERE id = ?`;
  const questionsSql = `SELECT * FROM quiz_questions WHERE quiz_id = ?`;

  db.query(quizSql, [id], (err, quizResult) => {
    if (err || quizResult.length === 0) return callback(err || { error: 'Not found' });

    db.query(questionsSql, [id], (err, questionResult) => {
      if (err) return callback(err);
      callback(null, { ...quizResult[0], questions: questionResult });
    });
  });
};

// Update Quiz + Questions
const updateQuiz = (id, data, callback) => {
  const { title, description, category, questions } = data;

  const updateQuizSql = `UPDATE quizzes SET title = ?, description = ?, category = ? WHERE id = ?`;
  db.query(updateQuizSql, [title, description, category, id], (err) => {
    if (err) return callback(err);

    // Delete old questions
    const deleteQuestionsSql = `DELETE FROM quiz_questions WHERE quiz_id = ?`;
    db.query(deleteQuestionsSql, [id], (err) => {
      if (err) return callback(err);

      // Insert new ones
      const values = questions.map(q => [
        id,
        q.question,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option
      ]);

      const insertQuestionsSql = `
        INSERT INTO quiz_questions 
        (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
        VALUES ?
      `;
      db.query(insertQuestionsSql, [values], callback);
    });
  });
};

// Delete Quiz
const deleteQuiz = (id, callback) => {
  const deleteQuestionsSql = `DELETE FROM quiz_questions WHERE quiz_id = ?`;
  const deleteQuizSql = `DELETE FROM quizzes WHERE id = ?`;

  db.query(deleteQuestionsSql, [id], (err) => {
    if (err) return callback(err);

    db.query(deleteQuizSql, [id], callback);
  });
};

module.exports = {
  createQuiz,
  addQuestions,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};
