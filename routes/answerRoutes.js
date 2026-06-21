const express = require('express');
const router = express.Router();
const Answer = require('../models/answer');
const Interview = require('../models/interview');
const Question = require('../models/question');
const { protect } = require('../middleware/authMiddleware');
const { evaluateAnswer } = require('../services/ai_services');

// بعت إجابة على سؤال
router.post('/submit', protect, async (req, res) => {
  try {
    const { interviewId, questionId, answerText } = req.body;

    // نجيب السؤال والإجابة النموذجية
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // نبعت للـ AI يقيم الإجابة
    const aiFeedback = await evaluateAnswer(
      question.text,
      answerText,
      question.modelAnswer
    );

    // نحفظ الإجابة مع التقييم
    const answer = new Answer({
      interview: interviewId,
      question: questionId,
      answerText,
      aiFeedback
    });

    await answer.save();

    res.status(201).json({
      message: 'Answer submitted successfully',
      aiFeedback
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;