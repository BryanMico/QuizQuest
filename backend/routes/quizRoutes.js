const express = require('express');
const router = express.Router();
const {createQuiz, getQuizzesByTeacher, getQuizById, updateQuiz, deleteQuiz, answerQuiz, getQuizzesStatus} = require('../controllers/quizController');

// ✅ CRUD Routes
router.post('/create/Quiz', createQuiz);
router.get('/get/Quiz/:teacherId', getQuizzesByTeacher);
router.get('/get/Quiz/:id', getQuizById);
router.get('/quizzes/:status/:teacherId', getQuizzesStatus);
router.put('/update/Quiz/:id', updateQuiz);
router.delete('/remove/Quiz/:id', deleteQuiz);

// ✅ Answering a Quiz
router.post('/:id/answer', answerQuiz);

module.exports = router;
