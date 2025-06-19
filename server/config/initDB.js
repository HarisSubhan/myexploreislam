const db = require('./db');

const initDB = () => {
  // USERS table (admin, parent)
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      role ENUM('admin', 'parent', 'child') DEFAULT 'parent',
      max_children INT DEFAULT 2,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // CHILDREN table (linked to parent)
  const childrenTable = `
    CREATE TABLE IF NOT EXISTS children (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      parent_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // db.query(userTable, (err) => {
  //   if (err) {
  //     console.log('❌ Error creating users table:', err.code, err.message);
  //   } else {
  //     console.log('✅ Users table ready.');

  //     db.query("SELECT * FROM users WHERE role = 'admin'", (err, results) => {
  //     if (err) return console.log('❌ Admin check error:', err.message);

  //     if (results.length === 0) {
  //       // No admin exists – create one without password
  //       const sql = `INSERT INTO users (name, email, role) VALUES (?, ?, 'admin')`;
  //       db.query(sql, ['Super Admin', 'admin@exploreislam.com'], (err) => {
  //         if (err) return console.log('❌ Failed to create admin:', err.message);
  //         console.log('✅ Default admin created (no password)');
  //       });
  //     }

  //   }

  // });

  db.query(userTable, (err) => {
    if (err) {
      console.log('❌ Error creating users table:', err.code, err.message);
    } else {
      console.log('✅ Users table ready.');

      db.query("SELECT * FROM users WHERE role = 'admin'", (err, results) => {
        if (err) return console.log('❌ Admin check error:', err.message);

        if (results.length === 0) {
          // No admin exists – create one without password
          const sql = `INSERT INTO users (name, email, role) VALUES (?, ?, 'admin')`;
          db.query(sql, ['Super Admin', 'admin@exploreislam.com'], (err) => {
            if (err) return console.log('❌ Failed to create admin:', err.message);
            console.log('✅ Default admin created (no password)');
          });
        }
      });
    }
  });


  db.query(childrenTable, (err) => {
    if (err) {
      console.log('❌ Error creating children table:', err.code, err.message);
    } else {
      console.log('✅ Users table ready.');
    }

  });
};

module.exports = initDB;
