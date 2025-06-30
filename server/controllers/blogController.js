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

module.exports = {
  createBlog,
};
