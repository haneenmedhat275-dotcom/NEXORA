const express = require('express');
const router = express.Router();
const Interview = require('../models/interview');
const Question = require('../models/question');
const { protect } = require('../middleware/authMiddleware');

// بدء انترفيو جديد
router.post('/start', protect, async (req, res, next) => {
  try {
    const technicalQuestions = await Question.aggregate([
      { $match: { category: 'technical' } },
      { $sample: { size: 5 } }
    ]);

    const personalQuestions = await Question.aggregate([
      { $match: { category: 'personal' } },
      { $sample: { size: 5 } }
    ]);

    const allQuestions = [...technicalQuestions, ...personalQuestions];

    const interview = new Interview({
      user: req.user.id,
      questions: allQuestions.map(q => q._id),
      status: 'ongoing',
      startedAt: new Date()
    });

    await interview.save();

    res.status(201).json({
      message: 'Interview started successfully',
      interviewId: interview._id,
      questions: allQuestions
    });

  } catch (error) {
    next(error);
  }
});

// جيب كل انترفيوهات اليوزر - لازم قبل /:id
router.get('/history', protect, async (req, res, next) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(interviews);

  } catch (error) {
    next(error);
  }
});

// إنهاء الانترفيو
router.put('/complete/:id', protect, async (req, res, next) => {
  try {
    const interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { status: 'completed', completedAt: new Date() },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json({ message: 'Interview completed successfully', interview });

  } catch (error) {
    next(error);
  }
});

// جيب انترفيو معين - لازم بعد /history
router.get('/:id', protect, async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('questions');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json(interview);

  } catch (error) {
    next(error);
  }
});

module.exports = router;