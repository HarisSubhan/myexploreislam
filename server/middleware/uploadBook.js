// middleware/uploadBook.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = 'uploads/books';
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for book files!'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for thumbnails!'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

const uploadBook = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 2
  }
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]);



module.exports = { uploadBook };