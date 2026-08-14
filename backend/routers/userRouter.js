const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/user — returns the authenticated user profile
router.get('/', async (req, res) => {
  try {
    const user = req.user.toObject();
    delete user.password;
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/user — update user profile fields
router.put('/', async (req, res) => {
  try {
    const { name, email, creditScore, riskRating, avatar } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (creditScore !== undefined) user.creditScore = creditScore;
    if (riskRating !== undefined) user.riskRating = riskRating;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    const updated = user.toObject();
    delete updated.password;

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
