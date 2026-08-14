const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * Creates a new user + 3 default accounts, returns JWT token.
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Generate unique account number
    const accountNumber = `${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`;

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      accountNumber,
      creditScore: 750,
      riskRating: 'Low Risk',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    });

    // Create 3 default accounts
    await Account.create([
      {
        userId: user._id,
        accountId: `chk-${user._id}`,
        name: 'Premier Checking',
        accountNumber: '•••• 8892',
        type: 'checking',
        balance: 0.00,
        currency: '$',
        icon: 'Landmark',
      },
      {
        userId: user._id,
        accountId: `sav-${user._id}`,
        name: 'High-Yield Growth Savings',
        accountNumber: '•••• 4412',
        type: 'savings',
        balance: 0.00,
        apy: '4.85%',
        currency: '$',
        icon: 'PiggyBank',
      },
      {
        userId: user._id,
        accountId: `crd-${user._id}`,
        name: 'Apex Sapphire Reserve',
        accountNumber: '•••• 1928',
        type: 'credit',
        balance: 0.00,
        creditLimit: 20000.00,
        dueDate: 'Aug 12, 2026',
        currency: '$',
        icon: 'CreditCard',
      },
    ]);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        creditScore: user.creditScore,
        riskRating: user.riskRating,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Validates credentials, returns JWT token.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountNumber: user.accountNumber,
        creditScore: user.creditScore,
        riskRating: user.riskRating,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
