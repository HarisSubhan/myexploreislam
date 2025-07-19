const db = require('../config/db');
const bcrypt = require('bcrypt');

const addChild = (req, res) => {
  const parentId = req.user.id;
  const { name, email, password, phoneNumber} = req.body;

  // Step 1: Check current child count
  db.query("SELECT COUNT(*) as child_count FROM children WHERE parent_id = ?", [parentId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error (child count)' });

    const count = results[0].child_count;
    
    // Step 2: Get max_children allowed from parent
    db.query("SELECT max_children FROM users WHERE id = ?", [parentId], (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ error: 'Parent not found' });

      const maxAllowed = results[0].max_children;

      if (count >= maxAllowed) {
        return res.status(400).json({ error: `Limit reached. You can add only ${maxAllowed} children.` });
      }

      // Step 3: Hash child password and insert
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: 'Hash error' });

        const sql = `INSERT INTO children (name, email, password, parent_id) VALUES (?, ?, ?, ?)`;
  const { name, email, password, phoneNumber} = req.body;
  db.query(sql, [name, email, hash, parentId, ], (err) => {
          if (err) return res.status(500).json({ error: 'Failed to add child' });

          res.status(201).json({ message: 'Child added successfully' });
        });
      });
    });
  });
};

module.exports = {
  addChild
};
