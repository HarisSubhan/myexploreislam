const path = require("path");
const Module = require("../models/moduleModel");
const db = require('../config/db'); // DB connection import


// Get all modules
const getModules = (req, res) => {
  Module.getAllModules((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Get module by ID
const getModule = (req, res) => {
  const { id } = req.params;
  Module.getModuleById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Module not found" });
    res.json(results[0]);
  });
};

// Create module (with image upload)
const addModule = (req, res) => {
  const { name } = req.body;
  if (!name || !req.file) {
    return res.status(400).json({ message: "Name and thumbnail image are required" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;

  Module.createModule(name, imageUrl, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res
      .status(201)
      .json({ message: "Module created", id: result.insertId, thumbnail_url: imageUrl });
  });
};

// Update module (with optional image)
const editModule = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  let imageUrl = req.body.thumbnail_url;

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  Module.updateModule(id, name, imageUrl, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Module updated" });
  });
};

// Delete module
const removeModule = (req, res) => {
  const { id } = req.params;
  Module.deleteModule(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Module deleted" });
  });
};

// Toggle active/inactive
const toggleModuleStatus = (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  if (typeof is_active === "undefined") {
    return res.status(400).json({ message: "is_active is required" });
  }

  Module.toggleModuleStatus(id, is_active, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `Module ${is_active ? "activated" : "deactivated"}` });
  });
};

// Soft delete module
const softDeleteModule = (req, res) => {
  const { id } = req.params;
  Module.softDeleteModule(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Module deleted successfully" });
  });
};

const getActiveModulesForChild = (req, res) => {
  db.query(
    "SELECT * FROM modules WHERE is_active = 1 AND is_deleted = 0 ORDER BY created_at DESC",
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

module.exports = {
  getModules,
  getModule,
  addModule,
  editModule,
  removeModule,
  toggleModuleStatus,
  softDeleteModule,
  getActiveModulesForChild
};
