const express = require('express');
const {getStudentInfo} = require('../controllers/studentController');

const router = express.Router();

// Corrected Routes
router.get('/get/student/:id', getStudentInfo);


module.exports = router;
