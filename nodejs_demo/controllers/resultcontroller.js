const Result = require('../models/result');
const Answer = require('../models/answer');
const { evaluateAnswerFromVideo } = require("../services/audioEvaluator");
const calculateResult = async (req, res, next) => {
  try {
    const { interviewId } = req.body;

    const answers = await Answer.find({ interview: interviewId })
      .populate('question');

    if (answers.length === 0) {
      return res.status(404).json({ message: 'No answers found' });
    }

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

    let recommendedTrack = '';
    if (technicalScore > personalScore) {
      recommendedTrack = 'Technical Track (Backend/Frontend Development)';
    } else {
      recommendedTrack = 'Soft Skills Track (Project Management/Business Analysis)';
    }

    const overallPct = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
    const technicalPct = technicalCount > 0 ? Math.round((technicalScore / (technicalCount * 10)) * 100) : 0
    const personalPct = personalCount > 0 ? Math.round((personalScore / (personalCount * 10)) * 100) : 0

    const result = new Result({
      interview: interviewId,
      user: req.user.id,
      totalScore: overallPct,
      maxScore: 100,
      summary: {
        technical: { score: technicalPct },
        personal: { score: personalPct }
      },
      feedback: `You scored ${overallPct}%. Technical: ${technicalPct}%, Personal: ${personalPct}%`,
      recommendedTrack
    });

    await result.save();

    res.status(201).json({
      message: 'Result calculated successfully',
      totalScore: overallPct,
      maxScore: 100,
      technicalScore: technicalPct,
      personalScore: personalPct,
      recommendedTrack,
      feedback: result.feedback
    });

  } catch (error) {
    next(error);
  }
};

const getResult = async (req, res, next) => {
  try {
    const result = await Result.findOne({ interview: req.params.id });

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json(result);

  } catch (error) {
    next(error);
  }
};

const getAnalytics = async (req, res, next) => {
  try {
    const results = await Result.find({ user: req.user.id });

    if (results.length === 0) {
      return res.status(200).json({
        totalInterviews: 0,
        averageScore: 0
      });
    }

    const totalInterviews = results.length;
    const averageScore = results.reduce((sum, r) => sum + r.totalScore, 0) / totalInterviews;

    res.status(200).json({
      totalInterviews,
      averageScore: Math.round(averageScore)
    });

  } catch (error) {
    next(error);
  }
};
const PDFDocument = require('pdfkit');

const downloadReport = async (req, res, next) => {
  try {
    const result = await Result.findOne({ interview: req.params.interviewId })
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const user = await require('../models/user').findById(req.user.id);

    // إنشاء الـ PDF
    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=report-${req.params.interviewId}.pdf`);

    doc.pipe(res);

    // المحتوى
    doc.fontSize(24).text('Interview Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Job Role: ${user.jobRole || 'N/A'}`);
    doc.moveDown();
    doc.fontSize(18).text('Results', { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Total Score: ${result.totalScore}`);
    doc.text(`Feedback: ${result.feedback}`);
    doc.text(`Recommended Track: ${result.recommendedTrack}`);
    doc.moveDown();
    doc.fontSize(12).text(`Date: ${result.createdAt.toDateString()}`);

    doc.end();

  } catch (error) {
    next(error);
  }
};

module.exports = { calculateResult, getResult, getAnalytics, downloadReport };
