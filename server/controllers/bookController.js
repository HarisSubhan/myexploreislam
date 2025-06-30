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

const getAllBooks = (req, res) => {
  bookModel.getAllBooks((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch books' });
    res.status(200).json(results);
  });
};

const getBookById = (req, res) => {
  const { id } = req.params;
  bookModel.getBookById(id, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'Book not found' });
    res.status(200).json(results[0]);
  });
};

const updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, category, pages } = req.body;

  const updated = { title, author, category, pages };
  bookModel.updateBook(id, updated, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update book' });
    res.json({ message: '✅ Book updated successfully' });
  });
};

const deleteBook = (req, res) => {
  const { id } = req.params;
  bookModel.deleteBook(id, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete book' });
    res.json({ message: '🗑️ Book deleted successfully' });
  });
};



module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
