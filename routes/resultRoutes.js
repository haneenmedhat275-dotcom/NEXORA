const express = require('express');
const router = express.Router();
const Result = require('../models/result');
const Answer = require('../models/answer');
const { protect } = require('../middleware/authMiddleware');

// حساب النتيجة النهائية
router.post('/calculate', protect, async (req, res) => {
  try {
    const { interviewId } = req.body;

    // نجيب كل إجابات الانترفيو
    const answers = await Answer.find({ interview: interviewId })
      .populate('question');

    if (answers.length === 0) {
      return res.status(404).json({ message: 'No answers found' });
    }

    // نحسب الدرجات
    let technicalScore = 0;
    let personalScore = 0;
    let technicalCount = 0;
    let personalCount = 0;

    answers.forEach(answer => {
      if (answer.question.category === 'technical') {
        technicalScore += answer.aiFeedback.score;
        technicalCount++;
      } else {
        personalScore += answer.aiFeedback.score;
        personalCount++;
      }
    });

    const totalScore = technicalScore + personalScore;
    const maxScore = answers.length * 10;

    // نحدد الـ track المقترح
    let recommendedTrack = '';
    if (technicalScore > personalScore) {
      recommendedTrack = 'Technical Track (Backend/Frontend Development)';
    } else {
      recommendedTrack = 'Soft Skills Track (Project Management/Business Analysis)';
    }

    // نحفظ النتيجة
    const result = new Result({
      interview: interviewId,
      user: req.user.id,
      totalScore,
      feedback: `You scored ${totalScore} out of ${maxScore}. Technical: ${technicalScore}/${technicalCount * 10}, Personal: ${personalScore}/${personalCount * 10}`,
      recommendedTrack
    });

    await result.save();

    res.status(201).json({
      message: 'Result calculated successfully',
      totalScore,
      maxScore,
      technicalScore,
      personalScore,
      recommendedTrack,
      feedback: result.feedback
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// جيب نتيجة انترفيو معين
router.get('/:interviewId', protect, async (req, res) => {
  try {
    const result = await Result.findOne({ interview: req.params.interviewId });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// إحصائيات اليوزر
router.get('/analytics', protect, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id });

    if (results.length === 0) {
      return res.status(200).json({
        totalInterviews: 0,
        averageScore: 0,
        averageTechnical: 0,
        averagePersonal: 0
      });
    }

    const totalInterviews = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.totalScore, 0) / totalInterviews;

    res.status(200).json({
      totalInterviews,
      averageScore: Math.round(averageScore),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;