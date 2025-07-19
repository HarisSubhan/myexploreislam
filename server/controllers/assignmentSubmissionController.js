const AssignmentSubmission = require('../models/assignmentSubmissionModel');

const submitAssignment = (req, res) => {
  const childId = req.user.id;
  const { assignment_id } = req.body;
  const file_url = req.file ? `/uploads/assignments/${req.file.filename}` : null;

  if (!assignment_id || !file_url) {
    return res.status(400).json({ error: 'Assignment ID and file are required' });
  }

  AssignmentSubmission.submit(assignment_id, childId, file_url, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to submit assignment' });
    res.json({ message: 'Assignment submitted successfully' });
  });
};

const getSubmissionsByAssignment = (req, res) => {
  const assignmentId = req.params.assignment_id;

  AssignmentSubmission.getByAssignment(assignmentId, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch submissions' });
    res.json(rows);
  });
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
};
