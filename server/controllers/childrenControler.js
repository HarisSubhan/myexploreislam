// controllers/childController.js
const Child = require('../models/childModel');

const getCurrentChildName = (req, res) => {
  const childId = req.user.id;

  Child.getChildById(childId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Child not found' });
    }

    const child = results[0];
    res.json({ name: child.name, email: child.email });
  });
};

const updateChildColor = (req, res) => {
  const parentId = req.user.id; // JWT se parent ki ID
  const { childId, color } = req.body;

  if (!childId || !color) {
    return res.status(400).json({ error: 'Child ID and color are required' });
  }

  Child.updateColor(childId, parentId, color, (err, result) => {
    if (err) {
      console.error('Error updating color:', err);
      return res.status(500).json({ error: 'Failed to update color' });
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({ error: 'Unauthorized or invalid child' });
    }

    res.json({ message: 'Color updated successfully' });
  });
};

module.exports = {
  getCurrentChildName,
  updateChildColor
};
