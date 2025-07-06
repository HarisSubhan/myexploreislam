const db = require('./db');

const initDB = () => {
  // USERS table (admin, parent)
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      phone_number VARCHAR(20) DEFAULT NULL,
      subscription_id INT,
      is_active BOOLEAN DEFAULT 1,
      is_deleted BOOLEAN DEFAULT NULL,
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
      color VARCHAR(20),
      parent_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  const videoTable = `
  CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    thumbnail_url VARCHAR(255),
    video_url VARCHAR(255),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const quizTable = `CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const quizQuestionsTable = `CREATE TABLE IF NOT EXISTS quiz_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    correct_option CHAR(1),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
  )`;


  const booksTable = `CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    category VARCHAR(100),
    pages INT,
    file_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const blogsTable = `CREATE TABLE IF NOT EXISTS blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255),
    publish_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const subscriptionTable = `CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    plan_name VARCHAR(100),         -- e.g., "Basic", "Premium", etc.
    price DECIMAL(10, 2),
    max_children INT DEFAULT 2,     -- default 2 allowed
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id)
  )`;

  const AssignmentsTable = `CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const categoriesTable = `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`;

  const childRequestTable = `CREATE TABLE IF NOT EXISTS child_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    requested_children INT DEFAULT 1,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
  )`;

  const quizSubmissionTable = `CREATE TABLE IF NOT EXISTS quiz_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    child_id INT,
    score INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  )`;

  const assignmentSubmissionTable = `CREATE TABLE IF NOT EXISTS assignment_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT,
    child_id INT,
    file_url VARCHAR(255),
    marks INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  )`;


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

  db.query(videoTable, (err) => {
    if (err) {
      console.log("❌ Error creating videos table:", err.message);
    } else {
      console.log("✅ Videos table ready.");
    }
  });

  db.query(quizTable, (err) => {
    if (err) {
      console.log("❌ Error creating Quiz table:", err.message);
    } else {
      console.log("✅ Quiz table ready.");
    }
  });

  db.query(quizQuestionsTable, (err) => {
    if (err) {
      console.log("❌ Error creating Quiz Questions table:", err.message);
    } else {
      console.log("✅ Quiz Questions table ready.");
    }
  });


  db.query(booksTable, (err) => {
    if (err) {
      console.log("❌ Error creating Books table:", err.message);
    } else {
      console.log("✅ Books table ready.");
    }
  });

  db.query(blogsTable, (err) => {
    if (err) {
      console.log("❌ Error creating Blogs table:", err.message);
    } else {
      console.log("✅ Blogs table ready.");
    }
  });

  db.query(subscriptionTable, (err) => {
    if (err) {
      console.log("❌ Error creating Subscription table:", err.message);
    } else {
      console.log("✅ Subscription table ready.");
    }
  });

  db.query(AssignmentsTable, (err) => {
    if (err) {
      console.log("❌ Error creating Assignment  table:", err.message);
    } else {
      console.log("✅ Assignment table ready.");
    }
  });

  db.query(categoriesTable, (err) => {
    if (err) {
      console.log("❌ Error creating Categories table:", err.message);
    } else {
      console.log("✅ Categories table ready.");
    }
  });

  db.query(childRequestTable, (err) => {
    if (err) {
      console.log("❌ Error creating Child Requests table:", err.message);
    } else {
      console.log("✅ Child Requests table ready.");
    }
  });

  db.query(quizSubmissionTable, (err) => {
    if (err) {
      console.log("❌ Error creating Quiz Submission table:", err.message);
    } else {
      console.log("✅ Quiz Submission table ready.");
    }
  });

  db.query(assignmentSubmissionTable, (err) => {
    if (err) {
      console.log("❌ Error creating Assignment Submission table:", err.message);
    } else {
      console.log("✅ Assignment Submission table ready.");
    }
  });

};

module.exports = initDB;
