const Coupon = require("../models/couponModel");

// ✅ Create Coupon
exports.createCoupon = (req, res) => {
  const {
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
  } = req.body;

  // Validate required fields
  if (!coupon_code || !coupon_name || !discount_type || !discount_value || !valid_from || !valid_until) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const couponData = {
    coupon_code,
    coupon_name,
    description,
    discount_type: discount_type.toUpperCase(),
    discount_value,
    max_discount,
    min_purchase_amount,
    valid_from,
    valid_until,
    usage_limit: usage_limit || 1,
    subscription_id,
    status: status?.toUpperCase() || "ACTIVE",
  };

  Coupon.createCoupon(couponData, (err, result) => {
    if (err) {
      console.error("Error creating coupon:", err.message);
      return res.status(500).json({ message: "Database error while creating coupon." });
    }

    res.status(201).json({
      message: "Coupon created successfully!",
      coupon_id: result.insertId,
    });
  });
};

// ✅ Get All Coupons
exports.getAllCoupons = (req, res) => {
  const Coupon = require("../models/couponModel");

  Coupon.getAllCoupons((err, results) => {
    if (err) {
      console.error("Error fetching coupons:", err.message);
      return res.status(500).json({ message: "Database error while fetching coupons." });
    }

    res.status(200).json({
      message: "Coupons fetched successfully!",
      total: results.length,
      data: results,
    });
  });
};
