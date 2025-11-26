const db = require("../config/db");
const bcrypt = require("bcrypt");

const addChild = (req, res) => {
  const parentId = req.user.id;
  const { name, username, email, password, age, profile_image, color } =
    req.body;

  // Validate required fields
  if (!name || !username || !email || !password || !age) {
    return res.status(400).json({
      error: "Name, username, email, password, and age are required fields",
    });
  }

  // Validate age is a positive number
  if (isNaN(age) || age < 0 || age > 18) {
    return res.status(400).json({
      error: "Age must be a valid number between 0 and 18",
    });
  }

  // Validate color format if provided
  if (color && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return res.status(400).json({
      error: "Color must be a valid hex color code (e.g., #FF5733)",
    });
  }

  // Step 1: Check current child count
  db.query(
    "SELECT COUNT(*) as child_count FROM children WHERE parent_id = ? AND is_deleted = 0",
    [parentId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error (child count)" });

      const count = results[0].child_count;

      // Step 2: Get max_children allowed from parent
      db.query(
        "SELECT max_children FROM users WHERE id = ?",
        [parentId],
        (err, results) => {
          if (err || results.length === 0)
            return res.status(500).json({ error: "Parent not found" });

          const maxAllowed = results[0].max_children;

          if (count >= maxAllowed) {
            return res
              .status(400)
              .json({
                error: `Limit reached. You can add only ${maxAllowed} children.`,
              });
          }

          // Step 3: Check if username exists (including soft-deleted)
          db.query(
            "SELECT * FROM children WHERE username = ? AND is_deleted = 0",
            [username],
            (err, existingUser) => {
              if (err)
                return res
                  .status(500)
                  .json({ error: "DB error (username check)" });
              if (existingUser.length > 0) {
                return res
                  .status(400)
                  .json({ error: "Username already taken" });
              }

              // Step 4: Check if email exists (including soft-deleted)
              db.query(
                "SELECT * FROM children WHERE email = ? AND is_deleted = 0",
                [email],
                (err, existingEmail) => {
                  if (err)
                    return res
                      .status(500)
                      .json({ error: "DB error (email check)" });
                  if (existingEmail.length > 0) {
                    return res
                      .status(400)
                      .json({ error: "Email already registered" });
                  }

                  // Step 5: Hash password and insert
                  bcrypt.hash(password, 10, (err, hash) => {
                    if (err)
                      return res.status(500).json({ error: "Hash error" });

                    // Default values
                    const defaultProfileImage =
                      profile_image || "default-child-avatar.png";
                    const defaultColor = color || generateRandomColor();

                    const sql = `INSERT INTO children 
                (name, username, email, password, age, profile_image, color, parent_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                    db.query(
                      sql,
                      [
                        name,
                        username,
                        email,
                        hash,
                        age,
                        defaultProfileImage,
                        defaultColor,
                        parentId,
                      ],
                      (err, result) => {
                        if (err) {
                          console.error("Database insertion error:", err);
                          return res
                            .status(500)
                            .json({ error: "Failed to add child" });
                        }

                        res.status(201).json({
                          message: "Child added successfully",
                          childId: result.insertId,
                        });
                      }
                    );
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

// Helper function to generate random color
function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  addChild,
};
