// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer '))
//     return res.status(401).json({ error: 'Unauthorized' });

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // contains id and role
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = verifyToken;

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

module.exports = {
  uploadAssignment,
};
