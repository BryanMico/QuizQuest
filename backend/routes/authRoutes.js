const express = require('express');
const { createAdmin, createStudent, login, logout } = require('../controllers/authController');

const router = express.Router();

// Corrected Routes
router.post('/create/admin', createAdmin);
router.post('/create/student', createStudent);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;
