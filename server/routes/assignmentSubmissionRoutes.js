const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const uploadAssignment = require('../middleware/assignmentsUpload'); // Use multer for file upload
const controller = require('../controllers/assignmentSubmissionController');

// Submit assignment (child)
router.post('/submit', verifyToken, uploadAssignment.single('file'), controller.submitAssignment);

// View submissions for a specific assignment (admin/parent)
router.get('/assignment/:assignment_id', verifyToken, controller.getSubmissionsByAssignment);

module.exports = router;
