const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const quizController = require('../controllers/quizController');

// Create quiz
router.post('/', verifyToken, isAdmin, quizController.createQuiz);

// Get all quizzes
router.get('/', quizController.getAllQuizzes);

// Get quiz by ID
router.get('/:id', quizController.getQuizById);

// Update quiz
router.put('/:id', verifyToken, isAdmin, quizController.updateQuiz);

// Delete quiz
router.delete('/:id', verifyToken, isAdmin, quizController.deleteQuiz);

module.exports = router;