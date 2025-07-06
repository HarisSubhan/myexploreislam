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

module.exports = {
  getCurrentChildName
};
