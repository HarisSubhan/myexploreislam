const db = require("../config/db");

// ✅ Create Coupon
exports.createCoupon = (data, callback) => {
  const sql = `
    INSERT INTO coupons (
      coupon_code, coupon_name, description, discount_type, discount_value,
      max_discount, min_purchase_amount, valid_from, valid_until,
      usage_limit, subscription_id, status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.coupon_code,
    data.coupon_name,
    data.description,
    data.discount_type,
    data.discount_value,
    data.max_discount,
    data.min_purchase_amount,
    data.valid_from,
    data.valid_until,
    data.usage_limit,
    data.subscription_id,
    data.status,
  ];

  db.query(sql, values, callback);
};


// ✅ Get All Coupons
exports.getAllCoupons = (callback) => {
  const sql = `
    SELECT 
      id,
      coupon_code,
      coupon_name,
      description,
      discount_type,
      discount_value,
      max_discount,
      min_purchase_amount,
      valid_from,
      valid_until,
      usage_limit,
      subscription_id,
      status,
      created_at,
      updated_at
    FROM coupons
    ORDER BY created_at DESC
  `;
  db.query(sql, callback);
};

exports.updateCoupon = (id, data, callback) => {
  const fields = [];
  const values = [];

  // Dynamically build SET clause based on provided fields
  for (const key in data) {
    fields.push(`${key} = ?`);
    values.push(data[key]);
  }

  const sql = `
    UPDATE coupons
    SET ${fields.join(", ")}, updated_at = NOW()
    WHERE id = ?
  `;

  values.push(id);
  db.query(sql, values, callback);
};

// ✅ Delete Coupon
exports.deleteCoupon = (id, callback) => {
  const sql = `DELETE FROM coupons WHERE id = ?`;
  db.query(sql, [id], callback);
};
