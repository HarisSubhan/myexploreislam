const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const videoController = require('../controllers/videoController');
const { uploadVideo, uploadThumbnail } = require('../middleware/upload');
const { multerUpload } = require('../middleware/upload');

// Upload video + thumbnail together
router.post(
  '/',
  verifyToken,
  isAdmin,
  multerUpload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  videoController.uploadVideoFile
);

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);

module.exports = router;