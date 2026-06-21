const express = require('express');
const router = express.Router();
const Interview = require('../models/interview');
const Question = require('../models/question');
const { protect } = require('../middleware/authMiddleware');

// بدء انترفيو جديد
router.post('/start', protect, async (req, res) => {
  try {
    // نجيب 5 أسئلة technical عشوائية
    const technicalQuestions = await Question.aggregate([
      { $match: { category: 'technical' } },
      { $sample: { size: 5 } }
    ]);

    // نجيب 5 أسئلة personal عشوائية
    const personalQuestions = await Question.aggregate([
      { $match: { category: 'personal' } },
      { $sample: { size: 5 } }
    ]);

    // ندمج الأسئلة
    const allQuestions = [...technicalQuestions, ...personalQuestions];

    // نعمل الانترفيو
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// جيب انترفيو معين
router.get('/:id', protect, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('questions');

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.status(200).json(interview);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// إنهاء الانترفيو
router.put('/complete/:id', protect, async (req, res) => {
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
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// جيب كل انترفيوهات اليوزر
router.get('/history', protect, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(interviews);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;