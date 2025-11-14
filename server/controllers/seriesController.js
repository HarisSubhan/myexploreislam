const db = require('../config/db');
const {
  getAllSeries,
  getSeriesById,
  createSeries,
  updateSeries,
  softDeleteSeries
} = require('../models/seriesModel');
// Get all series
const fetchAllSeries = (req, res) => {
  getAllSeries((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
// Get single series by ID
const fetchSeries = (req, res) => {
  getSeriesById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Series not found' });
    res.json(results[0]);
  });
};
const addSeries = (req, res) => {
  const { title, description, age } = req.body;   // :heavy_check_mark: age added
  const thumbnail_url = req.file ? `/uploads/${req.file.filename}` : null;
  createSeries(title, description, age, thumbnail_url, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Series added successfully', id: result.insertId });
  });
};
module.exports = {
  addSeries
};
// Update series
const editSeries = (req, res) => {
  const { title, description, age } = req.body;
  const thumbnail_url = req.file ? `/uploads/${req.file.filename}` : req.body.thumbnail_url;
  updateSeries(req.params.id, title, age, description, thumbnail_url, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Series updated successfully' });
  });
};
// Soft delete series
const removeSeries = (req, res) => {
  softDeleteSeries(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Series soft deleted successfully' });
  });
};
const getSeriesForChild = (req, res) => {
  const sql = `
    SELECT * FROM series
    WHERE is_deleted = 0
    ORDER BY created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
module.exports = {
  fetchAllSeries,
  fetchSeries,
  addSeries,
  editSeries,
  removeSeries,
  getSeriesForChild
};

