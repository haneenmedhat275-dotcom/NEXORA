const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalScore: {
    type: Number,
    min: 0,
    max: 100
  },
  maxScore: {
    type: Number,
    default: 100
  },
  averageScore: {
    type: Number,
    min: 0,
    max: 10
  },
  summary: {
    technical: {
      score: Number,
      feedback: String
    },
    personal: {
      score: Number,
      feedback: String
    }
  },
  overallFeedback: {
    type: String
  },
  recommendation: {
    type: String,
    enum: ['excellent', 'good', 'needsImprovement'],
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);