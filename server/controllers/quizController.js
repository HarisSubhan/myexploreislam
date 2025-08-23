const db = require('../config/db');
const quizModel = require('../models/quizModel');

// CREATE
const createQuiz = (req, res) => {
  const { title, description, video_id, questions } = req.body;
  if (!title || !Array.isArray(questions)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  quizModel.createQuiz({ title, description, video_id }, (err, result) => {
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
  const { title, description, video_id, questions } = req.body;

  quizModel.updateQuiz(id, { title, description, video_id, questions }, (err) => {
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