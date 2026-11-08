const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const passport = require('../config/passport');
const { upload } = require('../utils/upload');
const { parseCV } = require('../services/cvParser');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');

// ─── Multer config for profile avatar ─────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${req.user.id}-${Date.now()}${ext}`);
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG or JPG images are allowed'));
    }
  }
});

// Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return full user data (including avatar) so the image persists after login
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl || null
      }
    });

  } catch (error) {
    next(error);
  }
});

// Get Profile
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// Upload / Update Avatar
// protect must run before uploadAvatar so req.user exists when naming the file
router.post('/upload-avatar', protect, uploadAvatar.single('avatar'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Permanent URL stored in DB and returned to the frontend
    const newAvatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl: newAvatarUrl },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Avatar uploaded successfully',
      avatarUrl: user.avatarUrl,
      user
    });

  } catch (error) {
    next(error);
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      'Reset Your Password',
      `Click the link to reset your password: ${resetLink}\n\nThis link expires in 1 hour.`
    );

    res.status(200).json({ message: 'Reset email sent successfully' });

  } catch (error) {
    next(error);
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res, next) => {
  try {
    const { password } = req.body;

    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ message: 'Password reset successfully', token: newToken });

  } catch (error) {
    next(error);
  }
});

// Update Profile
router.put('/update-profile', protect, async (req, res, next) => {
  try {
    const { age, yearsOfExperience, jobRole, skills, currentJobTitle } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, {
      age, yearsOfExperience, jobRole, skills, currentJobTitle, isOnboarded: true
    }, { new: true }).select('-password');
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) { next(error); }
});

// Upload CV
router.post('/upload-cv', protect, upload.single('cv'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    await User.findByIdAndUpdate(req.user.id, { cvUrl: req.file.path });
    let extractedInfo = { name: '', currentJobTitle: '', age: null, yearsOfExperience: null, jobRole: '', skills: [] };
    try {
      const pdfHeader = fs.readFileSync(req.file.path).toString('ascii', 0, 5);
      if (pdfHeader !== '%PDF-') {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: 'Invalid PDF file. Please upload a real PDF document.' });
      }
      const info = await parseCV(req.file.path);
      if (info) extractedInfo = info;
    } catch (parseErr) { console.error('CV parse error:', parseErr.message); }
    res.status(200).json({ message: 'CV uploaded successfully', cvUrl: req.file.path, extractedInfo });
  } catch (error) { next(error); }
});

// ─── Google OAuth ─────────────────────────────────────────────

router.get('/google/status', (req, res) => {
  res.json({ configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) });
});

router.get('/google',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(501).json({ message: 'Google OAuth not configured on server' });
    }
    next();
  },
  passport.authenticate('google', { scope: ['openid', 'profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = require('jsonwebtoken').sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

// ─── Facebook OAuth ───────────────────────────────────────────

router.get('/facebook/status', (req, res) => {
  res.json({ configured: !!(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) });
});

router.get('/facebook',
  (req, res, next) => {
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      return res.status(501).json({ message: 'Facebook OAuth not configured on server' });
    }
    next();
  },
  passport.authenticate('facebook', { scope: ['public_profile'], session: false })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = require('jsonwebtoken').sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:5173/auth/callback?token=${token}`);
  }
);

module.exports = router;