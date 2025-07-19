const db = require('../config/db');
const path = require('path');

// Upload new assignment
const createAssignment = (req, res) => {
  const { title, description, category, video, dueDate } = req.body;

  if (!req.file) {
    console.log("Missing file:", req.file);
    return res.status(400).json({ error: "Assignment file is required" });
  }

  const filePath = `/uploads/assignments/${req.file.filename}`;

  const sql = `
    INSERT INTO assignments (title, description, file_url, category, video, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [title, description, filePath, category, video, dueDate],
    (err) => {
      if (err) {
        console.error("Upload error:", err.sqlMessage || err.message);
        return res.status(500).json({ error: "Failed to upload assignment" });
      }

      res.status(201).json({ message: "Assignment uploaded successfully" });
    }
  );
};


// Get all
const getAllAssignments = (req, res) => {
  const sql = `SELECT * FROM assignments ORDER BY created_at DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch assignments' });

    res.json(results);
  });
};

// Get by ID
const getAssignmentById = (req, res) => {
  const sql = `SELECT * FROM assignments WHERE id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(results[0]);
  });
};

// Update
const updateAssignment = (req, res) => {
  const { title, description, category } = req.body;
  const id = req.params.id;

  let fileSql = '';
  const values = [title, description, category];

  if (req.file) {
    fileSql = `, file_url = ?`;
    values.push(`/uploads/assignments/${req.file.filename}`);
  }

  values.push(id);

  const sql = `
    UPDATE assignments 
    SET title = ?, description = ?, category = ?${fileSql} 
    WHERE id = ?
  `;
  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update assignment' });

    res.json({ message: 'Assignment updated' });
  });
};

// Delete
const deleteAssignment = (req, res) => {
  const sql = `DELETE FROM assignments WHERE id = ?`;
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete assignment' });

    res.json({ message: 'Assignment deleted' });
  });
};

module.exports = {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment
};