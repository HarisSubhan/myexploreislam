const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { addChild } = require('../controllers/parentController');

router.post('/add-child', addChild);

module.exports = router;
