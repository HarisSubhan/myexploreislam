const db = require('../config/db');

// Get all series (including soft delete filter)
const getAllSeries = (callback) => {
  db.query('SELECT * FROM series WHERE is_deleted = 0 ORDER BY created_at DESC', callback);
};

// Get single series by ID
const getSeriesById = (id, callback) => {
  db.query('SELECT * FROM series WHERE id = ? AND is_deleted = 0', [id], callback);
};

// Add new series
const createSeries = (title, description, age, thumbnail_url, callback) => {
  db.query(
    'INSERT INTO series (title, description, age, thumbnail_url) VALUES (?, ?, ?, ?)',
    [title, description, age, thumbnail_url],
    callback
  );
};


// Update series
const updateSeries = (id, title, description, age, thumbnail_url, callback) => {
  db.query(
    'UPDATE series SET title = ?, description = ?, age, thumbnail_url = ? WHERE id = ? AND is_deleted = 0',
    [title, description, age, thumbnail_url, id],
    callback
  );
};

// Soft delete series
const softDeleteSeries = (id, callback) => {
  db.query('UPDATE series SET is_deleted = 1 WHERE id = ?', [id], callback);
};

module.exports = {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  softDeleteSeries
};
