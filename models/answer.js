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
  aiFeedback: {
    score: { type: Number },
    comment: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);