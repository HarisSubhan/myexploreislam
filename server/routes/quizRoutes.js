const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const quizController = require('../controllers/quizController');

// Create a new quiz with questions
router.post('/', verifyToken, isAdmin, quizController.createQuiz);

// // Get all quizzes
// router.get('/', quizController.getAllQuizzes);

// // Get single quiz with its questions
// router.get('/:id', quizController.getQuizById);

// // Update quiz and its questions
// router.put('/:id', verifyToken, isAdmin, quizController.updateQuiz);

// // Delete quiz
// router.delete('/:id', verifyToken, isAdmin, quizController.deleteQuiz);

module.exports = router;