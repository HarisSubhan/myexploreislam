const bookModel = require('../models/bookModel');

const addBook = (req, res) => {
  const { title, author, category, pages } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'PDF file is required' });
  }

  const file_url = `/uploads/books/${req.file.filename}`;

  const newBook = { title, author, category, pages, file_url };

  bookModel.addBook(newBook, (err) => {
    if (err) return res.status(500).json({ error: 'DB error while adding book' });
    res.status(201).json({ message: 'Book added successfully' });
  });
};

module.exports = { addBook };
