const db = require('./db');

const initDB = () => {
  // USERS table (admin, parent)
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      username VARCHAR(100) UNIQUE,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      phone_number VARCHAR(20) DEFAULT NULL,
      subscription_id INT,
      is_active BOOLEAN DEFAULT 1,
      is_deleted BOOLEAN DEFAULT 0,
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
      username VARCHAR(100) UNIQUE,
      email VARCHAR(100) UNIQUE,
      password VARCHAR(255),
      color VARCHAR(20),
      parent_id INT,
      age INT,
      is_active BOOLEAN DEFAULT 1,
      is_deleted BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  const videoTable = `
  CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    age INT NULL,
    thumbnail_url VARCHAR(255),
    series_id INT,
    video_url VARCHAR(255),
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const seriesTable = `CREATE TABLE IF NOT EXISTS series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    age INT NULL,
    thumbnail_url VARCHAR(255),
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const modulesTable = `CREATE TABLE IF NOT EXISTS modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    thumbnail_url VARCHAR(255),
    is_active BOOLEAN DEFAULT 1,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const quizTable = `CREATE TABLE IF NOT EXISTS quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    video_id INT,
    is_deleted BOOLEAN DEFAULT 0,
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
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const blogsTable = `CREATE TABLE IF NOT EXISTS blogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    banner_image VARCHAR(255),
    publish_date DATE,
    description TEXT,
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const subscriptionTable = `CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    plan_name VARCHAR(100),
    price DECIMAL(10, 2),
    max_children INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT 0,
    status ENUM('pending','active','canceled','expired') DEFAULT 'pending',
    session_id VARCHAR(255),
    payment_intent VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES users(id)
  );`;

  const AssignmentsTable = `CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    is_deleted BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;

  const categoriesTable = `CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_deleted BOOLEAN DEFAULT 0
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
    answers TEXT,
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
    video_id INT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
  )`;

  const userActivityTable = `CREATE TABLE IF NOT EXISTS user_activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action VARCHAR(255) NOT NULL,
    metadata TEXT,
    role VARCHAR(10),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`;


  const ticketsTable = `
    CREATE TABLE IF NOT EXISTS tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      parent_id INT,
      ticket_number VARCHAR(50) UNIQUE NOT NULL,
      subject VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('OPEN', 'PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const couponTable = `
    CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    coupon_name VARCHAR(100) NOT NULL,
    description TEXT,
    discount_type ENUM('PERCENTAGE', 'FIXED') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount DECIMAL(10,2),
    min_purchase_amount DECIMAL(10,2),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    usage_limit INT DEFAULT 1,
    subscription_id INT,
    status ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
  `;


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

  db.query(seriesTable, (err) => {
    if (err) {
      console.log("❌ Error creating series table:", err.message);
    } else {
      console.log("✅ Series table ready.");
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

  db.query(modulesTable, (err) => {
    if (err) {
      console.log("❌ Error creating Modules table:", err.message);
    } else {
      console.log("✅ Modules table ready.");
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

  db.query(userActivityTable, (err) => {
    if (err) {
      console.log("❌ Error creating User Activity table:", err.message);
    } else {
      console.log("✅ User Activity table ready.");
    }
  });

  db.query(ticketsTable, (err) => {
    if (err) {
      console.log("❌ Error creating Tickets table:", err.message);
    } else {
      console.log("✅ Tickets table ready.");
    }
  });


  db.query(couponTable, (err) => {
    if (err) {
      console.log("❌ Error creating Coupons table:", err.message);
    } else {
      console.log("✅ Coupons table ready.");
    }
  });

};

module.exports = initDB;
