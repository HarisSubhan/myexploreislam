const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponController");

// ✅ Create Coupon
router.post("/create", couponController.createCoupon);

// ✅ Get All Coupons
router.get("/", couponController.getAllCoupons);


module.exports = router;
