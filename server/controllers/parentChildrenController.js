const db = require("../config/db");
const ParentChildren = require("../models/parentChildrenModel");
const bcrypt = require("bcrypt");

// ✅ Get All Children of a Specific Parent
exports.getChildren = async (req, res) => {
  try {
    const parentId = req.params.parentId || req.user?.id; // if token-based later

    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required" });
    }

    const children = await ParentChildren.getChildrenByParentId(parentId);

    return res.status(200).json({
      message: "Children fetched successfully",
      total_children: children.length,
      data: children,
    });
  } catch (error) {
    console.error("Error fetching children:", error);
    return res.status(500).json({
      message: "Server error while fetching children",
      error: error.message,
    });
  }
};

exports.toggleChildStatus = (req, res) => {
  const { childId } = req.params;
  const { is_active } = req.body; // expect 0 or 1

  // Validation
  if (typeof is_active === "undefined") {
    return res.status(400).json({ message: "is_active field is required (0 or 1)" });
  }

  const sql = "UPDATE children SET is_active = ? WHERE id = ? AND is_deleted = 0";

  db.query(sql, [is_active, childId], (err, result) => {
    if (err) {
      console.error("Error updating child status:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Child not found or already deleted" });
    }

    res.json({
      message: `Child status updated successfully`,
      childId,
      new_status: is_active === 1 ? "Active" : "Inactive",
    });
  });
};

exports.updateChild = async (req, res) => {
  const { childId } = req.params;
  const { name, username, email, password, age, avatar } = req.body;

  try {
    // Validate at least one field
    if (!name && !username && !email && !password && !age && !avatar) {
      return res.status(400).json({ message: "At least one field is required to update." });
    }

    // Prepare dynamic query
    let fields = [];
    let values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (username) {
      fields.push("username = ?");
      values.push(username);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    if (age) {
      fields.push("age = ?");
      values.push(age);
    }

    if (avatar) {
      fields.push("avatar = ?");
      values.push(avatar);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    values.push(childId);

    const sql = `UPDATE children SET ${fields.join(", ")} WHERE id = ? AND is_deleted = 0`;

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error updating child:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Child not found or already deleted" });
      }

      res.json({ message: "Child updated successfully" });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteChild = (req, res) => {
  const childId = req.params.childId;
  const parentId = req.user?.id || req.body.parent_id || req.query.parent_id;

  if (!childId || !parentId) {
    return res.status(400).json({ message: "Child ID and Parent ID are required" });
  }

  console.log("Deleting childId:", childId, "for parentId:", parentId);

  const sql = "DELETE FROM children WHERE id = ? AND parent_id = ?";

  db.query(sql, [childId, parentId], (err, result) => {
    if (err) {
      console.error("Error deleting child:", err);
      return res.status(500).json({ message: "Database error while deleting child" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Child not found or not owned by this parent",
      });
    }

    res.status(200).json({
      message: "Child deleted successfully",
    });
  });
};
