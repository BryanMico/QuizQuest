const express = require('express');
const {getAllTeachers, createTeacher, updateTeacher, removeTeacher} = require('../controllers/adminController');


const router = express.Router();

// Corrected Routes
router.post('/create/teacher', createTeacher);
router.put('/update/teacher/:id', updateTeacher);
router.delete('/delete/teacher/:id', removeTeacher);
router.get('/get/teachers', getAllTeachers);


module.exports = router;
