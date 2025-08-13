const express = require("express");
const router = express.Router();
const moduleController = require("../controllers/moduleController");
const verifyToken = require('../middleware/auth');
const multer = require("multer");
const path = require("path");

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// CRUD routes
router.get("/child", verifyToken, moduleController.getActiveModulesForChild);
router.get("/", verifyToken, moduleController.getModules);
router.get("/:id", verifyToken, moduleController.getModule);
router.post("/", verifyToken, upload.single("thumbnail"), moduleController.addModule);
router.put("/:id", verifyToken, upload.single("thumbnail"), moduleController.editModule);
router.delete("/:id", verifyToken, moduleController.removeModule);
router.put("/:id/toggle", verifyToken, moduleController.toggleModuleStatus);
router.delete("/:id/soft", verifyToken, moduleController.softDeleteModule);

module.exports = router;
