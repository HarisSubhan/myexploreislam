const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();
const { createUser, findUserByEmail } = require('../models/userModel');

// Example: setPassword function
const setPassword = (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ? AND role = 'admin'", [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const user = results[0];

    if (user.password) {
      return res.status(400).json({ error: 'Password already set' });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Error hashing password' });

      db.query("UPDATE users SET password = ? WHERE id = ?", [hash, user.id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to update password' });
        res.json({ message: 'Password set successfully' });
      });
    });
  });
};

const register = (req, res) => {
  const { name, email, password } = req.body;

  const role = 'parent'; // 👈 only parent can register from frontend

  // Check if user already exists
  findUserByEmail(email, (err, users) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (users.length > 0) return res.status(400).json({ error: 'Email already registered' });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ error: 'Hashing error' });

      createUser(name, email, hash, role, (err, result) => {
        if (err) return res.status(500).json({ error: 'Insert failed' });

        res.status(201).json({ message: 'Parent registered successfully' });
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, users) => {
    if (err || users.length === 0) return res.status(401).json({ error: 'Invalid email or password' });

    const user = users[0];

    bcrypt.compare(password, user.password, (err, match) => {
      if (err || !match) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });
  });
};



module.exports = {
  register,
  login,
  setPassword
};
