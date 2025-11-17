const express = require('express');
const router = express.Router();
const seriesController = require('../controllers/seriesController');
const verifyToken = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
router.get('/child/all', verifyToken, seriesController.getSeriesForChild);
// router.get('/child/all', seriesController.getSeriesForChild);

router.get('/', verifyToken, seriesController.fetchAllSeries);
router.get('/all-series', seriesController.fetchAllSeries);
router.get('/:id', verifyToken, seriesController.fetchSeries);
router.post('/', verifyToken, upload.single('thumbnail'), seriesController.addSeries);
router.put('/:id', verifyToken, upload.single('thumbnail'), seriesController.editSeries);
router.delete('/:id', verifyToken, seriesController.removeSeries);

module.exports = router;
