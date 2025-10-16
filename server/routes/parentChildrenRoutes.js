const express = require("express");
const router = express.Router();
const parentChildrenController = require("../controllers/parentChildrenController");

// ✅ Route to Get All Children of a Parent
router.get("/:parentId/children", parentChildrenController.getChildren);

router.put("/:childId/status", parentChildrenController.toggleChildStatus);

router.put("/:childId/edit", parentChildrenController.updateChild);

router.delete("/child/:childId", parentChildrenController.deleteChild);

module.exports = router;
