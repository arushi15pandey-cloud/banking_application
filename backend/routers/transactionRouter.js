const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// GET /api/transactions — returns all transactions, optional ?category= filter
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Run /api/seed first.' });
    }

    const filter = { userId: user._id };
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 });

    // Map to frontend-compatible shape (use _id as id with 'tx-' prefix)
    const mapped = transactions.map((t) => ({
      id: t._id,
      title: t.title,
      category: t.category,
      amount: t.amount,
      type: t.type,
      date: t.date,
      account: t.account,
      status: t.status,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/transactions — create a new transaction entry
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { title, category, amount, type, date, account, status } = req.body;
    if (!title || !amount || !type || !account) {
      return res.status(400).json({ success: false, message: 'title, amount, type, and account are required.' });
    }

    const tx = await Transaction.create({
      userId: user._id,
      title,
      category: category || 'Other',
      amount: parseFloat(amount),
      type,
      date: date || new Date().toISOString().split('T')[0],
      account,
      status: status || 'Completed',
    });

    res.status(201).json({ success: true, data: tx });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
