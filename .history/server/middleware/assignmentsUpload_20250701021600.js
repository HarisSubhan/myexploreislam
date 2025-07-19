const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const assignmentDir = path.join(__dirname, "../uploads/assignments");
if (!fs.existsSync(assignmentDir))
  fs.mkdirSync(assignmentDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, assignmentDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const uploadAssignment = multer({ storage });

module.exports = { uploadAssignment };
