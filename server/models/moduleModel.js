const db = require("../config/db");

// Get all modules
// const getAllModules = (callback) => {
//   db.query("SELECT * FROM modules", callback);
// };

// Get module by ID
const getModuleById = (id, callback) => {
  db.query("SELECT * FROM modules WHERE id = ?", [id], callback);
};

// Create module
const createModule = (name, thumbnail_url, callback) => {
  db.query("INSERT INTO modules (name, thumbnail_url) VALUES (?, ?)", [name, thumbnail_url], callback);
};

// Update module
const updateModule = (id, name, thumbnail_url, callback) => {
  db.query("UPDATE modules SET name = ?, thumbnail_url = ? WHERE id = ?", [name, thumbnail_url, id], callback);
};

// Delete module
const deleteModule = (id, callback) => {
  db.query("DELETE FROM modules WHERE id = ?", [id], callback);
};

const toggleModuleStatus = (id, is_active, callback) => {
  db.query("UPDATE modules SET is_active = ? WHERE id = ?", [is_active, id], callback);
};

// Soft delete
const softDeleteModule = (id, callback) => {
  db.query("UPDATE modules SET is_deleted = 1 WHERE id = ?", [id], callback);
};

// Get all modules (skip deleted)
const getAllModules = (callback) => {
  db.query("SELECT * FROM modules WHERE is_deleted = 0", callback);
};

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  softDeleteModule,
  toggleModuleStatus
};
