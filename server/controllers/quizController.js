const db = require('../config/db');
const quizModel = require('../models/quizModel');

// CREATE
const createQuiz = (req, res) => {
  const { title, description, category, questions } = req.body;
  if (!title || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  quizModel.createQuiz({ title, description, category }, (err, result) => {
    if (err) return res.status(500).json({ error: 'Quiz creation failed' });

    const quizId = result.insertId;

    quizModel.addQuestions(quizId, questions, (err) => {
      if (err) return res.status(500).json({ error: 'Question insert failed' });

      res.status(201).json({ message: 'Quiz created successfully' });
    });
  });
};

// GET ALL
const getAllQuizzes = (req, res) => {
  quizModel.getAllQuizzes((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch quizzes' });
    res.json(results);
  });
};

// GET BY ID
const getQuizById = (req, res) => {
  const { id } = req.params;

  quizModel.getQuizById(id, (err, data) => {
    if (err) return res.status(404).json({ error: 'Quiz not found' });
    res.json(data);
  });
};

// UPDATE
const updateQuiz = (req, res) => {
  const { id } = req.params;
  const { title, description, category, questions } = req.body;

  quizModel.updateQuiz(id, { title, description, category, questions }, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update quiz' });
    res.json({ message: 'Quiz updated successfully' });
  });
};

// DELETE
const deleteQuiz = (req, res) => {
  const { id } = req.params;

  quizModel.deleteQuiz(id, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete quiz' });
    res.json({ message: 'Quiz deleted successfully' });
  });
};

module.exports = {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
};

// ✅ Create Quiz with Questions
// const createQuiz = (req, res) => {
//   const { title, description, category, questions } = req.body;

//   if (!title || !questions || !Array.isArray(questions)) {
//     return res.status(400).json({ error: 'Invalid quiz data' });
//   }

//   const quizSql = `INSERT INTO quizzes (title, description, category) VALUES (?, ?, ?)`;
//   db.query(quizSql, [title, description, category], (err, result) => {
//     if (err) return res.status(500).json({ error: 'Failed to create quiz' });

//     const quizId = result.insertId;

//     const questionValues = questions.map(q => [
//       quizId,
//       q.question,
//       q.option_a,
//       q.option_b,
//       q.option_c,
//       q.option_d,
//       q.correct_option
//     ]);

//     const questionSql = `
//       INSERT INTO quiz_questions 
//       (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
//       VALUES ?
//     `;

//     db.query(questionSql, [questionValues], (err) => {
//       if (err) return res.status(500).json({ error: 'Failed to insert questions' });

//       res.status(201).json({ message: 'Quiz created successfully' });
//     });
//   });
// };



// module.exports = {
//     createQuiz,
// };