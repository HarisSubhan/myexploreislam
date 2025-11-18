const db = require("../config/db");

// ✅ Get All Children by Parent ID
const getChildrenByParentId = (parentId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        id,
        name,
        username,
        email,
        avatar,
        age, 
        is_active,
        is_deleted,
        created_at
      FROM children
      WHERE parent_id = ? AND is_deleted = 0
      ORDER BY created_at DESC
    `;

    db.query(query, [parentId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { getChildrenByParentId };
