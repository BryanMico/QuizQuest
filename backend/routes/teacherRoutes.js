const express = require('express');
const {createStudent, getAllStudents, getTeacherInfo, updateStudent, removeStudent} = require('../controllers/teacherController');

const router = express.Router();

// Corrected Routes
router.get('/get/teacher/:id', getTeacherInfo);
router.post('/create/student', createStudent);
router.get('/get/students/:teacherId', getAllStudents);
router.put('/update/student/:id', updateStudent); 
router.delete('/remove/student/:id', removeStudent); 

module.exports = router;
