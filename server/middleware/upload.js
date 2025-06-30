const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure folders exist
const ensurePath = (folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
};

ensurePath('uploads/videos');
ensurePath('uploads/thumbnails');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/videos');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails');
    } else {
      cb(new Error('Invalid file field'), false);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + ext;
    cb(null, filename);
  }
});


const multerUpload = multer({ storage });



module.exports = { multerUpload };
