const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes')); // ✅
app.use('/api/reports', require('./routes/reportRoutes'));       // ✅

// Error logger - يظهر الـ error بالتفصيل
app.use((err, req, res, next) => {
  console.error('\n========== ERROR ==========');
  console.error('Time:', new Date().toISOString());
  console.error('Method:', req.method);
  console.error('URL:', req.originalUrl);
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('===========================\n');
  next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} ✅`));