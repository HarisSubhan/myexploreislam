const bcrypt = require('bcryptjs');
const db = require('../config/db');

const User = require('../models/userModel');

const getStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS parentCount FROM users WHERE role = 'parent'", (err, parentResult) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    stats.parents = parentResult[0].parentCount;

    db.query("SELECT COUNT(*) AS childCount FROM children", (err, childResult) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      stats.children = childResult[0].childCount;

      stats.totalUsers = stats.parents + stats.children;

      db.query("SELECT COUNT(*) AS videoCount FROM videos", (err, videoResult) => {
        if (err) return res.status(500).json({ error: 'DB error (videos)' });
        stats.videos = videoResult[0].videoCount;

        db.query("SELECT COUNT(*) AS assignmentCount FROM assignments", (err, assignmentResult) => {
          if (err) return res.status(500).json({ error: 'DB error' });
          stats.assignments = assignmentResult[0].assignmentCount;

          db.query("SELECT COUNT(*) AS quizCount FROM quizzes", (err, quizResult) => {
            if (err) return res.status(500).json({ error: 'DB error' });
            stats.quizzes = quizResult[0].quizCount;

            db.query("SELECT COUNT(*) AS blogCount FROM blogs", (err, blogResult) => {
              if (err) return res.status(500).json({ error: 'DB error' });
              stats.blogs = blogResult[0].blogCount;

              res.json(stats);
            });
          });
        });
      });
    });
  });
};


const getAllParents = (req, res) => {
  const sql = `
    SELECT u.id, u.name, u.email, COUNT(c.id) AS child_count
    FROM users u
    LEFT JOIN children c ON u.id = c.parent_id
    WHERE u.role = 'parent'
    GROUP BY u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
};

const getAllChildren = (req, res) => {
  const sql = `
    SELECT c.id, c.name, c.email, u.name AS parent_name
    FROM children c
    JOIN users u ON c.parent_id = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
};

const getSingleParent = (req, res) => {
  const { id } = req.params;
  db.query("SELECT id, name, email, max_children FROM users WHERE id = ? AND role = 'parent'", [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'Parent not found' });
    res.json(results[0]);
  });
};

const updateParent = (req, res) => {
  const { id } = req.params;
  const { name, email, max_children } = req.body;

  const sql = `UPDATE users SET name = ?, email = ?, max_children = ? WHERE id = ? AND role = 'parent'`;
  db.query(sql, [name, email, max_children, id], (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Parent updated' });
  });
};

const deleteParent = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ? AND role = 'parent'", [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Parent deleted' });
  });
};

const getSingleChild = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT c.id, c.name, c.email, u.name as parent_name
    FROM children c JOIN users u ON c.parent_id = u.id
    WHERE c.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'Child not found' });
    res.json(results[0]);
  });
};

const updateChild = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  db.query("UPDATE children SET name = ?, email = ? WHERE id = ?", [name, email, id], (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });
    res.json({ message: 'Child updated' });
  });
};

const deleteChild = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM children WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Child deleted' });
  });
};

const getAdminProfile = (req, res) => {
  const adminId = req.user.id;

  User.getById(adminId, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const { id, name, email, role } = results[0];
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ id, name, email });
  })
}

const updateAdminProfile = (req, res) => {
  const { name, email, password } = req.body;
  const adminId = req.user.id;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and Email required' });
  }

  User.updateByID(adminId, name, email, password, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update admin' });
    res.json({ message: 'Profile updated successfully' });
  });
}

const getAllUsers = (req, res) => {
  const getParentsQuery = `
    SELECT 
      id AS user_id,
      name AS user_name,
      email,
      role,
      is_active
    FROM users
    WHERE role = 'parent'
  `;

  const getChildrenQuery = `
    SELECT 
      c.id AS child_id,
      c.name AS child_name,
      c.email AS child_email,
      c.color,
      c.created_at,
      u.id AS parent_id,
      u.name AS parent_name,
      u.email AS parent_email,
      u.is_active
    FROM children c
    JOIN users u ON u.id = c.parent_id
  `;

  db.query(getParentsQuery, (err, parents) => {
    if (err) {
      console.error('Error fetching parents:', err);
      return res.status(500).json({ error: 'Error fetching parents' });
    }

    db.query(getChildrenQuery, (err2, children) => {
      if (err2) {
        console.error('Error fetching children:', err2);
        return res.status(500).json({ error: 'Error fetching children' });
      }

      const formattedParents = parents.map(p => ({
        type: 'parent',
        user_id: p.user_id,
        name: p.user_name,
        email: p.email,
        role: p.role,
        is_active: p.is_active
      }));

      const formattedChildren = children.map(c => ({
        type: 'child',
        child_id: c.child_id,
        name: c.child_name,
        email: c.child_email,
        color: c.color,
        created_at: c.created_at,
        parent: {
          id: c.parent_id,
          name: c.parent_name,
          email: c.parent_email
        }
      }));

      const allUsers = [...formattedParents, ...formattedChildren];
      res.json(allUsers);
    });
  });
};



module.exports = {
  getStats,
  getAllParents,
  getAllChildren,
  getSingleParent,
  updateParent,
  deleteParent,
  getSingleChild,
  updateChild,
  deleteChild,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers
};
