const db = require('../config/db');

const addBook = (book, callback) => {
  const { title, author, category, pages, file_url } = book;
  const sql = `INSERT INTO books (title, author, category, pages, file_url) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [title, author, category, pages, file_url], callback);
};

const getAllBooks = (callback) => {
  db.query('SELECT * FROM books ORDER BY created_at DESC', callback);
};

const getBookById = (id, callback) => {
  db.query('SELECT * FROM books WHERE id = ?', [id], callback);
};

const updateBook = (id, data, callback) => {
  const { title, author, category, pages } = data;
  const sql = `
    UPDATE books
    SET title = ?, author = ?, category = ?, pages = ?
    WHERE id = ?
  `;
  db.query(sql, [title, author, category, pages, id], callback);
};

const deleteBook = (id, callback) => {
  db.query('DELETE FROM books WHERE id = ?', [id], callback);
};



module.exports = { addBook, getAllBooks, getBookById, updateBook, deleteBook };
