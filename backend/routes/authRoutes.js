const express = require('express');
const { createAdmin, login, logout } = require('../controllers/authController');

const router = express.Router();

// Corrected Routes
router.post('/create/admin', createAdmin);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
