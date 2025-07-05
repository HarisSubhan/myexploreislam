const ChildRequest = require('../models/childRequestModel');

const requestMoreChildren = (req, res) => {
  const parentId = req.user.id;
  const { requested_children } = req.body;

  if (!requested_children || requested_children < 1) {
    return res.status(400).json({ error: 'Invalid number of children requested.' });
  }

  ChildRequest.createRequest(parentId, requested_children, (err, result) => {
    if (err) return res.status(500).json({ error: 'Server error' });

    res.json({ message: 'Request submitted successfully.' });
  });
};

const getAllRequests = (req, res) => {
  ChildRequest.getAll((err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch requests' });
    res.json(results);
  });
};

const updateRequestStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  ChildRequest.updateStatus(id, status, (err) => {
    if (err) return res.status(500).json({ error: 'Update failed' });

    if (status === 'approved') {
      ChildRequest.getById(id, (err2, rows) => {
        if (err2 || rows.length === 0)
          return res.status(500).json({ error: 'Failed to update max children' });

        const { parent_id, requested_children } = rows[0];
        ChildRequest.incrementMaxChildren(parent_id, requested_children, () => {});
      });
    }

    res.json({ message: 'Request status updated.' });
  });
};

module.exports = {
  requestMoreChildren,
  getAllRequests,
  updateRequestStatus
};
