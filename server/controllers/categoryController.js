const db = require('../config/db');


// GET all categories
exports.getCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// ADD new category
exports.addCategory = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });

  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ id: result.insertId, name });
  });
};

// UPDATE a category
exports.updateCategory = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Category name is required" });

  db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id, name });
  });
};

// DELETE a category
exports.deleteCategory = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ success: true });
  });
};
