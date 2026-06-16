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
    required: true
  },
  feedback: {
    type: String
  },
  recommendedTrack: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);