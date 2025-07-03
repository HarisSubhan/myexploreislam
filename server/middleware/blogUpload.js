const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure blog upload folder exists
const blogDir = 'uploads/blogs';
if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, blogDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-blog' + ext;
    cb(null, filename);
  },
});

const uploadBlogBanner = multer({ storage });

module.exports = uploadBlogBanner;
