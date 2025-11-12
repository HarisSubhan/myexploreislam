const db = require('../config/db');

const bcrypt = require('bcryptjs');


const createUser = (name, username, email, password, role, phone_number, subscription_id, callback) => {
  db.query(
    `INSERT INTO users 
      (name, username, email, password, role, phone_number, subscription_id, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, username, email, password, role, phone_number, subscription_id, 0],
    callback
  );
};



const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], callback);
};

const findUserByUsername = (username, callback) => {
  db.query("SELECT * FROM users WHERE username = ?", [username], callback);
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

const findChildByEmail = (email, callback) => {
  const query = 'SELECT * FROM children WHERE email = ?';
  db.query(query, [email], callback);
};

module.exports = {
  createUser,
  findUserByEmail,
  getById,
  updateByID,
  findChildByEmail,
  findUserByUsername
};