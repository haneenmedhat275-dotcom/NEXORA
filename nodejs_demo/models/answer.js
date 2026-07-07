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
    pauses: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);