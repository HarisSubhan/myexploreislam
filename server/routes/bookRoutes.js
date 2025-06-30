const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { uploadBook } = require('../middleware/uploadBook');
const bookController = require('../controllers/bookController');

// Only admin can add books
router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadBook.single('pdf'),
  bookController.addBook
);

module.exports = router;
