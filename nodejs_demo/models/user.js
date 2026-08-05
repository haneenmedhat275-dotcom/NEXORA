const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Step 1 - Basic Info
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

  // Step 2 - Complete Profile
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

  // Step 3 - Upload CV
  cvUrl: {
    type: String
  },
  cvOriginalName: {
    type: String
  },

  // Profile photo
  avatarUrl: {
    type: String
  },

  // Step 4 - Finalize
  isOnboarded: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);