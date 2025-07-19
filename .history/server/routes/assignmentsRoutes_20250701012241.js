const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const { createAssignment, getAllAssignments, getAssignmentById, updateAssignment, deleteAssignment} = require('../controllers/AssigmentController');
const { uploadAssignment } = require('../middleware/assignmentsUpload');


// Create a new quiz with questions
router.post('/', uploadAssignment.single('file'), verifyToken, isAdmin, createAssignment);

// Get all Assignment
router.get('/', getAllAssignments);

// Get single Assignment with its questions
router.get('/:id', getAssignmentById);

// Update Assignment and its questions
router.put('/:id',uploadAssignment.single('file'), verifyToken, isAdmin, updateAssignment);

// Delete quiz
router.delete('/:id', verifyToken, isAdmin, deleteAssignment);

module.exports = router;