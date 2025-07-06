const User = require('../models/userModel');

const getCurrentUserName = (req, res) => {
  const userId = req.user.id;

  User.getById(userId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json({ name: user.name, email: user.email });
  });
};

const getCurrentChildName = (req, res) => {
  console.log(req.user);
  const userId = req.user.id;

  User.getChildById(userId, (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json({ name: user.name });
  });
};


module.exports = {
    getCurrentUserName,
    getCurrentChildName
}