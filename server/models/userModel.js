const db = require('../config/db');

const bcrypt = require('bcryptjs');


const createUser = (name, email, password, role, callback) => {
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, password, role], callback);
};

const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], callback);
};


const getById = (id, callback) => {
  db.query(`SELECT * FROM users WHERE id = ?`, [id], callback);
};

const updateByID = (id, name, email, password, callback) => {
  let sql = `UPDATE users SET name = ?, email = ?`;
  const params = [name, email];

  if (password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    sql += `, password = ?`;
    params.push(hashedPassword);
  }

  sql += ` WHERE id = ? AND role = 'admin'`;
  params.push(id);

  db.query(sql, params, callback);
}

// module.exports = { createUser, findUserByEmail, getById, updateByID  };


const findChildByEmail = (email, callback) => {
  const query = 'SELECT * FROM children WHERE email = ?';
  db.query(query, [email], callback);
};


// module.exports = { createUser, findUserByEmail, findChildByEmail };

module.exports = {
  createUser,
  findUserByEmail,
  getById,
  updateByID,
  findChildByEmail,
};