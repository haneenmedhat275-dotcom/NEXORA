const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  answerText: {
    type: String,
    required: true
  },
  transcription: {
    type: String
  },
  videoUrl: {
    type: String
  },
  aiFeedback: {
    score: { type: Number },
    comment: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }]
  },
  speechMetrics: {
    durationSeconds: { type: Number },
    wpm: { type: Number },
    pauses: { type: Number },
    tone: { type: String, enum: ['confident', 'neutral', 'hesitant', 'monotone', 'enthusiastic'] },
    clarity: { type: String, enum: ['clear', 'moderate', 'unclear', 'muffled'] }
  }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);