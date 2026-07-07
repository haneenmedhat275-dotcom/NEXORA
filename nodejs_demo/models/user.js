const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ✅ خطوة 1 - Basic Info
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'graduate'],
    default: 'student'
  },
  age: {
    type: Number
  },
  yearsOfExperience: {
    type: Number
  },

  // ✅ خطوة 2 - Complete Profile
  jobRole: {
    type: String
  },
  skills: {
    type: [String],
    default: []
  },
  currentJobTitle: {
    type: String
  },

  // ✅ خطوة 3 - Upload CV
  cvUrl: {
    type: String
  },

  // ✅ خطوة 4 - Finalize
  isOnboarded: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);