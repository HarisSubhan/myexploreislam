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

router.get('/stream/:filename', (req, res) => {
  const videoPath = path.join(__dirname, '../uploads/videos', req.params.filename);

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
});

module.exports = router;
