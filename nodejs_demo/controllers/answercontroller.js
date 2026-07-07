const Answer = require('../models/answer');
const Question = require('../models/question');
const Interview = require('../models/interview');
const { evaluateAnswer, evaluateAnswerFromVideo, transcribeAudio } = require('../services/audioEvaluator');

const submitAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionIndex } = req.body;

    // Look up the interview to get the questionId at the given index
    const interview = await Interview.findById(interviewId).populate('questions');
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const idx = parseInt(questionIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= interview.questions.length) {
      return res.status(400).json({ message: 'Invalid questionIndex' });
    }

    const question = interview.questions[idx];
    if (!question) {
      return res.status(404).json({ message: 'Question not found at that index' });
    }

    let answerText = '';

    // If an audio file was uploaded, transcribe it
    if (req.file) {
      const transcription = await transcribeAudio(req.file.path);
      answerText = transcription || '[Transcription failed]';
    } else {
      answerText = req.body.answerText || '';
    }

    const aiFeedback = await evaluateAnswer(
      question.text,
      answerText,
      question.modelAnswer
    );

    const answer = new Answer({
      interview: interviewId,
      question: question._id,
      answerText,
      aiFeedback
    });

    await answer.save();

    res.status(201).json({
      message: 'Answer submitted successfully',
      answer: {
        ...answer.toObject(),
        aiFeedback
      }
    });

  } catch (error) {
    console.log('Full error:', error);
    next(error);
  }
};

const submitVideoAnswer = async (req, res, next) => {
  try {
    const { interviewId, questionId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const result = await evaluateAnswerFromVideo(
      question.text,
      question.modelAnswer,
      req.file.path
    );

    const answer = new Answer({
      interview: interviewId,
      question: questionId,
      answerText: result.transcription || '[Transcription failed]',
      transcription: result.transcription,
      videoUrl: req.file.path,
      aiFeedback: { score: result.score, comment: result.comment, strengths: result.strengths, weaknesses: result.weaknesses },
      speechMetrics: result.speechMetrics // { durationSeconds, wpm, pauses }
    });

    await answer.save();

    res.status(201).json({
      message: 'Video answer submitted successfully',
      answer,
      debug: result.error || null
    });

  } catch (error) {
    next(error);
  }
};

const getAnswersByInterview = async (req, res, next) => {
  try {
    const answers = await Answer.find({ interview: req.params.interviewId })
      .populate('question')
      .sort({ createdAt: 1 });
    res.status(200).json(answers);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitAnswer, submitVideoAnswer, getAnswersByInterview };