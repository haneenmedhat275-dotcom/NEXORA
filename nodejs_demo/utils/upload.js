const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files allowed'), false);
  }
};

const videoFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-flv', 'video/mpeg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only video files allowed (mp4, webm, mov, avi, flv, mpeg)'), false);
  }
};

const audioFilter = (req, file, cb) => {
  const allowed = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/x-wav'];
  if (allowed.includes(file.mimetype) || file.originalname.match(/\.(webm|mp4|m4a|mp3|wav|ogg)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files allowed (webm, mp4, m4a, mp3, wav, ogg)'), false);
  }
};

const upload = multer({ storage, fileFilter });
const videoUpload = multer({ storage, fileFilter: videoFilter, limits: { fileSize: 50 * 1024 * 1024 } });
const audioUpload = multer({ storage, fileFilter: audioFilter, limits: { fileSize: 50 * 1024 * 1024 } });

module.exports = { upload, videoUpload, audioUpload };