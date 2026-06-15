const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Register - تسجيل يوزر جديد
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // التحقق إن الإيميل مش مسجل قبل كده
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // تشفير الباسوورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء اليوزر
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;