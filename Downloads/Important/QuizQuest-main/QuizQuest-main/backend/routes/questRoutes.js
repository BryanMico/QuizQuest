const express = require('express');
const {createQuest, getTeacherQuests, getActiveQuestsForStudent, updateQuest, deleteQuest, completeQuest, getStudentQuestProgress, changeQuestStatus } = require('../controllers/questController');

const router = express.Router();

// Teacher routes
router.post('/quests', createQuest);
router.get('/quests/teacher/:teacherId', getTeacherQuests);
router.put('/:questId', updateQuest);
router.delete('/delete/quests/:questId', deleteQuest);
router.put('/:questId/status', changeQuestStatus);

// Student routes
router.get('/student/:studentId/:teacherId', getActiveQuestsForStudent);
router.post('/:questId/complete', completeQuest);
router.get('/progress/:studentId', getStudentQuestProgress);

module.exports = router;