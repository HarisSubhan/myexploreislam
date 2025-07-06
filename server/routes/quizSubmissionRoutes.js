const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const quizController = require('../controllers/quizSubmissionController');

// Child submits quiz
router.post('/submit', verifyToken, quizController.submitQuiz);

// Admin/parent views submissions for a quiz
router.get('/quiz/:quiz_id', verifyToken, quizController.getSubmissionsByQuiz);

module.exports = router;
