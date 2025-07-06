const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads/assignments directory exists
const ensurePath = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensurePath("uploads/assignments");

// Storage config
const assignmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/assignments");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + file.fieldname + ext;
    cb(null, filename);
  },
});

const uploadAssignment = multer({ storage: assignmentStorage });

module.exports = uploadAssignment;
