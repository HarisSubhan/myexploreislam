const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const logUserActivity = require('../utils/activityLogger');
require('dotenv').config();
const { createUser, findUserByEmail, findUserByUsername, findChildByEmail } = require('../models/userModel');

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
  const { name, username, email, password, phone_number, subscription_id } = req.body;
  const role = 'parent'; // 👈 only parent can register from frontend

  if (!username || !name || !email || !password) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }

  // Check if username already exists
  findUserByUsername(username, (err, usersWithUsername) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (usersWithUsername.length > 0) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Check if email already exists
    findUserByEmail(email, (err, usersWithEmail) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (usersWithEmail.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Hashing error' });

        // Create new user
        createUser(name, username, email, hash, role, phone_number, subscription_id, (err, result) => {
          if (err) return res.status(500).json({ error: 'Insert failed' });

          res.status(201).json({ message: 'Parent registered successfully' });
        });
      });
    });
  });
};

const login = (req, res) => {
  const { identifier, password } = req.body; // 👈 identifier = email ya username

  if (!identifier || !password) {
    return res.status(400).json({ error: 'Email/Username and password are required' });
  }

  // First check in `users` table (parent)
  db.query(
    "SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1",
    [identifier, identifier],
    (err, users) => {
      if (err) return res.status(500).json({ error: 'Server error' });

      if (users.length > 0) {
        const user = users[0];

        bcrypt.compare(password, user.password, (err, match) => {
          if (err || !match) return res.status(401).json({ error: 'Invalid credentials' });

          const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
          );

          logUserActivity(user.id, 'Logged In', {}, 'parent');

          return res.json({
            message: 'Login successful',
            token,
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              role: user.role
            }
          });
        });
      } else {
        // If not found in users, check in children table
        db.query(
          "SELECT * FROM children WHERE email = ? OR username = ? LIMIT 1",
          [identifier, identifier],
          (err, children) => {
            if (err || children.length === 0)
              return res.status(401).json({ error: 'Invalid email/username or password' });

            const child = children[0];

            bcrypt.compare(password, child.password, (err, match) => {
              if (err || !match)
                return res.status(401).json({ error: 'Invalid credentials' });

              const token = jwt.sign(
                { id: child.id, role: 'child' },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
              );

              logUserActivity(child.id, 'Logged In', {}, 'child');

              res.json({
                message: 'Login successful',
                token,
                user: {
                  id: child.id,
                  name: child.name,
                  username: child.username,
                  email: child.email,
                  role: 'child',
                  parent_id: child.parent_id
                }
              });
            });
          }
        );
      }
    }
  );
};


const logout = (req, res) => {

  const userId = req.user.id;
  const role = req.user.role;

  logUserActivity(userId, 'Logged Out', {}, role);

  res.json({ message: 'Logout successful' });
};



module.exports = {
  register,
  login,
  setPassword,
  logout
};
