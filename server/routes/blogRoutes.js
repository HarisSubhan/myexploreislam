const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const uploadBlogBanner = require('../middleware/blogUpload'); // 👈 updated import
const blogController = require('../controllers/blogController');

// POST - Add a blog with banner image
router.post(
  '/',
  verifyToken,
  isAdmin,
  uploadBlogBanner.single('banner'), // 👈 updated usage
  blogController.createBlog
);

module.exports = router;
