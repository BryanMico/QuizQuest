const express = require('express');
const {createReward, getTeacherRewards, removeReward, editReward, buyReward, getStudentPurchasedRewards, getTeacherStudentsPurchasedRewards, fulfillReward} = require('../controllers/rewardController');
const router = express.Router();

router.post('/create/reward', createReward);
router.get('/rewards/:teacherId', getTeacherRewards);
router.delete('/rewards/:rewardId', removeReward);
router.put('/rewards/:rewardId', editReward);

// New routes for buying and tracking rewards
router.post('/buy', buyReward);
router.get('/purchased/student/:studentId', getStudentPurchasedRewards);
router.get('/purchased/teacher/:teacherId', getTeacherStudentsPurchasedRewards);
router.put('/fulfill/:purchaseId',  fulfillReward);

module.exports = router;
