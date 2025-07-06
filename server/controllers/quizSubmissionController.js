const QuizSubmission = require('../models/quizSubmissionModel');

const submitQuiz = (req, res) => {
  const childId = req.user.id;
  const { quiz_id, score } = req.body;

  if (!quiz_id || score === undefined) {
    return res.status(400).json({ error: 'Quiz ID and score are required' });
  }

  QuizSubmission.submit(quiz_id, childId, score, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to submit quiz' });
    res.json({ message: 'Quiz submitted successfully' });
  });
};

const getSubmissionsByQuiz = (req, res) => {
  const quizId = req.params.quiz_id;

  QuizSubmission.getByQuiz(quizId, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch submissions' });
    res.json(rows);
  });
};

module.exports = {
  submitQuiz,
  getSubmissionsByQuiz,
};
