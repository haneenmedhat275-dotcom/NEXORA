const express = require('express');
const router = express.Router();
const Report = require('../models/result');
const Interview = require('../models/interview');
const Answer = require('../models/answer');
const { protect } = require('../middleware/authMiddleware');

// جيب كل ريبورتس اليوزر
router.get('/', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id })
      .populate('interview')
      .sort('-createdAt');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جيب ريبورت انترفيو معين
router.get('/:interviewId', protect, async (req, res) => {
  try {
    const answers = await Answer.find({ interview: req.params.interviewId })
      .populate('question');

    const scored = answers.filter(a => a.aiFeedback?.score != null);
    const totalScore = scored.length
      ? Math.round(scored.reduce((sum, a) => sum + a.aiFeedback.score, 0) / scored.length * 10)
      : 0;

    res.json({
      interviewId: req.params.interviewId,
      totalScore,
      totalQuestions: answers.length,
      answeredQuestions: scored.length,
      answers: answers.map(a => ({
        question: a.question?.text,
        answerText: a.answerText,
        score: a.aiFeedback?.score,
        comment: a.aiFeedback?.comment
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// اعمل ريبورت نهائي واحفظه
router.post('/generate/:interviewId', protect, async (req, res) => {
  try {
    const answers = await Answer.find({ interview: req.params.interviewId })
      .populate('question');

    const scored = answers.filter(a => a.aiFeedback?.score != null);
    const totalScore = scored.length
      ? Math.round(scored.reduce((sum, a) => sum + a.aiFeedback.score, 0) / scored.length * 10)
      : 0;

    const existing = await Report.findOne({ interview: req.params.interviewId });
    if (existing) return res.json(existing);

    const report = await Report.create({
      interview: req.params.interviewId,
      user: req.user.id,
      totalScore,
      feedback: totalScore >= 70 ? 'Strong performance' : 'Needs improvement',
      recommendedTrack: totalScore >= 70 ? 'Advanced' : 'Beginner'
    });

    await Interview.findByIdAndUpdate(req.params.interviewId, {
      status: 'completed'
    });

    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;