const express = require('express');
const router = express.Router();
const {createQuiz, getQuizzesByTeacher, getQuizById, updateQuiz, deleteQuiz, answerQuiz, getQuizzesStatus, getQuizCompletions, getAllCurrentQuizzes} = require('../controllers/quizController');

// ✅ CRUD Routes
router.post('/create/Quiz', createQuiz);
router.get('/get/Quiz/:teacherId', getQuizzesByTeacher);
router.get('/get/Quiz/:id', getQuizById);
router.get('/quizzes/:status/:teacherId/:studentId', getQuizzesStatus);
router.put('/update/Quiz/:id', updateQuiz);
router.delete('/remove/Quiz/:id', deleteQuiz);
router.get('/:id/completions', getQuizCompletions);


// ✅ Answering a Quiz
router.post('/:id/answer', answerQuiz);

// Add this route
router.get('/quizzes/all-current', getAllCurrentQuizzes);

module.exports = router;
