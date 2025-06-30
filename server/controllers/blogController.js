const blogModel = require('../models/blogModel');

const createBlog = (req, res) => {
  const { title, publish_date, description } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Banner image is required' });
  }

  const banner_image = `/uploads/blogs/${req.file.filename}`;

  const blogData = {
    title,
    banner_image,
    publish_date,
    description,
  };

  blogModel.createBlog(blogData, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to create blog' });
    res.status(201).json({ message: 'Blog created successfully' });
  });
};

// Get all blogs (Admin)
const getAllBlogs = (req, res) => {
  blogModel.getAll((err, blogs) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch blogs' });
    res.json(blogs);
  });
};

// Get blog by ID (Admin)
const getBlogById = (req, res) => {
  blogModel.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch blog' });
    if (result.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result[0]);
  });
};

// Update blog
const updateBlog = (req, res) => {
  const { title, description, publish_date } = req.body;
  const banner = req.file ? `/uploads/blogs/${req.file.filename}` : null;

  blogModel.update(req.params.id, { title, description, publish_date, banner }, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update blog' });
    res.json({ message: 'Blog updated successfully' });
  });
};

// Delete blog
const deleteBlog = (req, res) => {
  blogModel.remove(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete blog' });
    res.json({ message: 'Blog deleted successfully' });
  });
};

// Get latest 3 blogs (public)
const getLatestBlogs = (req, res) => {
  blogModel.getLatest((err, blogs) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch blogs' });
    res.json(blogs);
  });
};

// Public blog by ID
const getPublicBlogById = (req, res) => {
  blogModel.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch blog' });
    if (result.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result[0]);
  });
};


module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getLatestBlogs,
  getPublicBlogById

};
