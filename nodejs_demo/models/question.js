const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technical', 'personal'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  modelAnswer: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);