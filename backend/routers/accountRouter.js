const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const User = require('../models/User');

// GET /api/accounts — returns all accounts for the demo user
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Run /api/seed first.' });
    }

    const accounts = await Account.find({ userId: user._id }).sort({ createdAt: 1 });

    // Map to frontend-compatible shape (use accountId as id)
    const mapped = accounts.map((a) => ({
      id: a.accountId,
      name: a.name,
      accountNumber: a.accountNumber,
      type: a.type,
      balance: a.balance,
      currency: a.currency,
      apy: a.apy,
      creditLimit: a.creditLimit,
      dueDate: a.dueDate,
      icon: a.icon,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/accounts/:accountId/balance — directly set an account balance
router.put('/:accountId/balance', async (req, res) => {
  try {
    const { balance } = req.body;
    if (balance === undefined || isNaN(parseFloat(balance))) {
      return res.status(400).json({ success: false, message: 'Valid balance value is required.' });
    }

    const account = await Account.findOneAndUpdate(
      { accountId: req.params.accountId },
      { balance: parseFloat(balance) },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
