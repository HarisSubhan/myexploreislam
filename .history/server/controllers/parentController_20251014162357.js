const ChildRequest = require("../models/childRequestModel");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/children/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "child-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const requestMoreChildren = (req, res) => {
  const parentId = req.user.id;
  const { requested_children, child_age } = req.body;

  // Get uploaded file path
  const child_image = req.file ? req.file.filename : null;

  if (!requested_children || requested_children < 1) {
    return res
      .status(400)
      .json({ error: "Invalid number of children requested." });
  }

  if (!child_age || child_age < 0 || child_age > 18) {
    return res
      .status(400)
      .json({ error: "Invalid child age. Must be between 0 and 18." });
  }

  ChildRequest.createRequest(
    parentId,
    requested_children,
    child_age,
    child_image,
    (err, result) => {
      if (err) return res.status(500).json({ error: "Server error" });

      res.json({
        message: "Request submitted successfully.",
        requestId: result.insertId,
      });
    }
  );
};

const getAllRequests = (req, res) => {
  ChildRequest.getAll((err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch requests" });

    // Add full image URL to each result
    const requestsWithImageUrl = results.map((request) => ({
      ...request,
      child_image_url: request.child_image
        ? `${req.protocol}://${req.get("host")}/uploads/children/${
            request.child_image
          }`
        : null,
    }));

    res.json(requestsWithImageUrl);
  });
};

const updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  ChildRequest.updateStatus(id, status, (err) => {
    if (err) return res.status(500).json({ error: "Update failed" });

    if (status === "approved") {
      ChildRequest.getById(id, (err2, rows) => {
        if (err2 || rows.length === 0)
          return res
            .status(500)
            .json({ error: "Failed to update max children" });

        const { parent_id, requested_children } = rows[0];
        ChildRequest.incrementMaxChildren(
          parent_id,
          requested_children,
          () => {}
        );
      });
    }

    res.json({ message: "Request status updated." });
  });
};

// Serve static files for uploaded images
const serveChildImages = express.static("uploads/children");

module.exports = {
  requestMoreChildren: [upload.single("child_image"), requestMoreChildren],
  getAllRequests,
  updateRequestStatus,
  serveChildImages,
};
