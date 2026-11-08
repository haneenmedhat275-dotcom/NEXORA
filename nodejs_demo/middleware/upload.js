const multer = require('multer');
const path = require('path');
const fs = require('fs');

const AVATAR_DIR = path.join(__dirname, '..', 'uploads', 'avatars');
const RESUME_DIR = path.join(__dirname, '..', 'uploads', 'resumes');

// Make sure the upload folders exist.
[AVATAR_DIR, RESUME_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// --- Avatar (profile photo): PNG / JPG / WEBP, max 2MB ---
const AVATAR_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const AVATAR_MAX_SIZE = 2 * 1024 * 1024; // 2MB

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_DIR),
  filename: (req, file, cb) => {
    // req.user is set by the `protect` middleware, which must run before this.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: AVATAR_MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!AVATAR_ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('Image must be PNG, JPG, or WEBP'));
    }
    cb(null, true);
  }
});

// --- Resume / CV: PDF only, max 5MB ---
const RESUME_ALLOWED_TYPES = ['application/pdf'];
const RESUME_MAX_SIZE = 5 * 1024 * 1024; // 5MB

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, RESUME_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
  }
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: { fileSize: RESUME_MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!RESUME_ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(new Error('File must be a PDF'));
    }
    cb(null, true);
  }
});

module.exports = { avatarUpload, resumeUpload };
