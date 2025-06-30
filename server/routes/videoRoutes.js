// const express = require('express');
// const router = express.Router();
// const verifyToken = require('../middleware/auth');
// const isAdmin = require('../middleware/isAdmin');
// const videoController = require('../controllers/videoController');
// const { uploadVideo, uploadThumbnail } = require('../middleware/upload');
// const { multerUpload } = require('../middleware/upload');

// // Upload video + thumbnail together
// router.post(
//   '/',
//   verifyToken,
//   isAdmin,
//   multerUpload.fields([
//     { name: 'video', maxCount: 1 },
//     { name: 'thumbnail', maxCount: 1 },
//   ]),
//   videoController.uploadVideoFile
// );

// router.get('/', videoController.getAllVideos);
// router.get('/:id', videoController.getVideoById);

// module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  uploadVideoFile,
  getAllVideos,
  getVideoById,
} = require('../controllers/videoController');

// Setup multer
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: videoStorage });

router.post(
  '/upload',
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  uploadVideoFile
);

router.get('/', getAllVideos);
router.get('/:id', getVideoById);

module.exports = router;
