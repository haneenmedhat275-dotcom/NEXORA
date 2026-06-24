const express = require('express');
require('dotenv').config();

const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const answerRoutes = require('./routes/answerRoutes');
const resultRoutes = require('./routes/resultRoutes');

const app = express();
const reportRoutes = require('./routes/reportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Security and parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

// Connect to database
connectDB();

// Routes (use plural endpoints)
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/answers', answerRoutes);
app.use('/api/results', resultRoutes);
//report routes
app.use('/api/reports', reportRoutes);
app.get('/', (req, res) => res.send('<h1>Hello from the server</h1>'));
// Analytics routes
app.use('/api/analytics', analyticsRoutes);

// Centralized error handler (last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
