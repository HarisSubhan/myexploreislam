const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { addChild } = require('../controllers/parentController');

// router.post('/add-child', verifyToken, addChild);
router.post(
  "/add-child",
  verifyToken,
  upload.single("profile_image"),
  addChild
);

module.exports = router;
