const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');  // ⬅️ سطر جديد

const app = express();
app.use(express.json());

const interviewRoutes = require('./routes/interviewRoutes');
app.use('/api/interview', interviewRoutes);
// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoutes);  // ⬅️ سطر جديد

app.get('/', (req, res) => {
  res.send('<h1>Hello from the server</h1>');
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});