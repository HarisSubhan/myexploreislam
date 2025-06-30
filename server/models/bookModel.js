const db = require('../config/db');

const addBook = (book, callback) => {
  const { title, author, category, pages, file_url } = book;
  const sql = `INSERT INTO books (title, author, category, pages, file_url) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [title, author, category, pages, file_url], callback);
};

module.exports = { addBook };
