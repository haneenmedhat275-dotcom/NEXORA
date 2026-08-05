const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { audioUpload } = require('../utils/upload');
const { submitAnswer, getAnswersByInterview, getMyAnswers } = require('../controllers/answercontroller');

router.post('/submit', protect, audioUpload.single('audio'), submitAnswer);
router.get('/interview/:interviewId', protect, getAnswersByInterview);
router.get('/my', protect, getMyAnswers);

module.exports = router;