const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const adminController = require('../controllers/adminController');

// All routes are protected by admin
router.use(verifyToken, isAdmin);

router.get('/stats', adminController.getStats);
router.get('/parents', adminController.getAllParents);
router.get('/children', adminController.getAllChildren);

// Parents
router.get('/parent/:id', adminController.getSingleParent);
router.put('/parent/:id', adminController.updateParent);
router.delete('/parent/:id', adminController.deleteParent);

// Children
router.get('/child/:id', adminController.getSingleChild);
router.put('/child/:id', adminController.updateChild);
router.delete('/child/:id', adminController.deleteChild);

// Admin
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);

module.exports = router;
