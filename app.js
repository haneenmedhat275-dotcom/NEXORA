const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();
app.use(express.json());

const answerRoutes = require('./routes/answerRoutes');
app.use('/api/answer', answerRoutes);

const resultRoutes = require('./routes/resultRoutes');
app.use('/api/result', resultRoutes);
// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Hello from the server</h1>');
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
