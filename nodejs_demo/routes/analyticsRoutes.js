const express = require('express');
const router = express.Router();
const Interview = require('../models/interview');
const Answer = require('../models/answer');
const Result = require('../models/result');
const { protect } = require('../middleware/authMiddleware');

// Dashboard Summary
router.get('/dashboard', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id });
    const completed = interviews.filter(i => i.status === 'completed');
    
    const results = await Result.find({ user: req.user.id });
    const avgScore = results.length
      ? Math.round(results.reduce((sum, r) => sum + r.totalScore, 0) / results.length)
      : 0;

    res.json({
      totalInterviews: interviews.length,
      completedInterviews: completed.length,
      averageScore: avgScore,
      overallReadiness: avgScore
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Progress
router.get('/progress', protect, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .populate('interview')
      .sort('createdAt');

    const progress = results.map(r => ({
      date: r.createdAt,
      score: r.totalScore,
      feedback: r.feedback
    }));

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Skills Breakdown
router.get('/skills', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id });
    const interviewIds = interviews.map(i => i._id);

    const answers = await Answer.find({ interview: { $in: interviewIds } })
      .populate('question');

    const technical = answers.filter(a => a.question?.category === 'technical');
    const personal = answers.filter(a => a.question?.category === 'personal');

    const avgScore = (arr) => arr.length
      ? Math.round(arr.reduce((sum, a) => sum + (a.aiFeedback?.score || 0), 0) / arr.length * 10)
      : 0;

    res.json({
      technicalScore: avgScore(technical),
      personalScore: avgScore(personal)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;