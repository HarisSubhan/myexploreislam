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
  uploadBlogBanner.single('banner_image'), // 👈 updated usage
  blogController.createBlog
);

// GET /api/blogs
router.get('/', verifyToken, isAdmin, blogController.getAllBlogs);


router.get('/', verifyToken, isAdmin, blogController.getAllBlogs);
router.get('/:id', verifyToken, isAdmin, blogController.getBlogById);
router.put('/:id', verifyToken, isAdmin, uploadBlogBanner.single('banner_image'), blogController.updateBlog);
router.delete('/:id', verifyToken, isAdmin, blogController.deleteBlog);

// Public Routes
router.get('/public/latest', blogController.getLatestBlogs);
router.get('/public/:id', blogController.getPublicBlogById);

module.exports = router;
