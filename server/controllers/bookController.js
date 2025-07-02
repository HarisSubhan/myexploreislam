const bookModel = require('../models/bookModel');

const addBook = (req, res) => {
  try {
    const { title, author, category, pages } = req.body;

    if (!req.files?.pdf) {
      return res.status(400).json({ error: 'PDF file is required' });
    }

    if (!req.files?.thumbnail) {
      return res.status(400).json({ error: 'Thumbnail image is required' });
    }

    const file_url = `/uploads/books/${req.files.pdf[0].filename}`;
    const thumbnail_url = `/uploads/books/${req.files.thumbnail[0].filename}`;

    const newBook = { 
      title, 
      author, 
      category, 
      pages: parseInt(pages), 
      file_url, 
      thumbnail_url 
    };


    bookModel.addBook(newBook, (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          error: 'DB error while adding book',
          details: err.message 
        });
      }
      res.status(201).json({ message: 'Book added successfully' });
    });

  } catch (error) {
    console.error('Error in addBook:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    });
  }
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
