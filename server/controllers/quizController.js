const db = require('../config/db');

// ✅ Create Quiz with Questions
const createQuiz = (req, res) => {
  const { title, description, category, questions } = req.body;

  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Invalid quiz data' });
  }

  const quizSql = `INSERT INTO quizzes (title, description, category) VALUES (?, ?, ?)`;
  db.query(quizSql, [title, description, category], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create quiz' });

    const quizId = result.insertId;

    const questionValues = questions.map(q => [
      quizId,
      q.question,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_option
    ]);

    const questionSql = `
      INSERT INTO quiz_questions 
      (quiz_id, question, option_a, option_b, option_c, option_d, correct_option)
      VALUES ?
    `;

    db.query(questionSql, [questionValues], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to insert questions' });

      res.status(201).json({ message: 'Quiz created successfully' });
    });
  });
};


module.exports = {
    createQuiz,
};