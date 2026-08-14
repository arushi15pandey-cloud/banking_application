const express = require('express');
const router = express.Router();
const Policy = require('../models/Policy');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/policies — returns all active insurance policies
router.get('/', async (req, res) => {
  try {
    const policies = await Policy.find({ userId: req.user._id }).sort({ createdAt: -1 });

    // Map to frontend-compatible shape (use policyId as id)
    const mapped = policies.map((p) => ({
      id: p.policyId,
      type: p.type,
      title: p.title,
      coverage: p.coverage,
      monthlyPremium: p.monthlyPremium,
      nextPaymentDate: p.nextPaymentDate,
      status: p.status,
      deductible: p.deductible,
      insuredSubject: p.insuredSubject,
      autoDebitAccount: p.autoDebitAccount,
      icon: p.icon,
      color: p.color,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/policies — apply for a new insurance policy
 * Body: {
 *   type,           // 'Health' | 'Auto' | 'Home' | 'Life'
 *   title,
 *   coverage,
 *   monthlyPremium,
 *   deductible,     // optional, default 500
 *   insuredSubject
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { type, title, coverage, monthlyPremium, deductible, insuredSubject } = req.body;
    if (!type || !title || !coverage || !monthlyPremium || !insuredSubject) {
      return res.status(400).json({
        success: false,
        message: 'type, title, coverage, monthlyPremium, and insuredSubject are required.',
      });
    }

    const premium = parseFloat(monthlyPremium);
    if (isNaN(premium) || premium <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid monthly premium amount.' });
    }

    // Generate unique policy ID e.g. 'POL-HLT-4921'
    const typeCode = type.substring(0, 3).toUpperCase();
    const policyId = `POL-${typeCode}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Determine icon and color based on type
    const iconMap = { Health: 'HeartPulse', Auto: 'Car', Home: 'Home', Life: 'ShieldCheck' };
    const colorMap = { Health: 'emerald', Auto: 'blue', Home: 'purple', Life: 'amber' };

    // Debit first month's premium from checking account
    const checkingAcc = await Account.findOne({ type: 'checking', userId: req.user._id });
    if (!checkingAcc) {
      return res.status(404).json({ success: false, message: 'Checking account not found.' });
    }
    if (checkingAcc.balance < premium) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds in checking account for initial premium.',
      });
    }
    checkingAcc.balance -= premium;
    await checkingAcc.save();

    // Create the policy
    const nextPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const newPolicy = await Policy.create({
      userId: req.user._id,
      policyId,
      type,
      title,
      coverage: parseFloat(coverage),
      monthlyPremium: premium,
      nextPaymentDate,
      status: 'Active',
      deductible: parseFloat(deductible) || 500,
      insuredSubject,
      autoDebitAccount: `${checkingAcc.name} (${checkingAcc.accountNumber})`,
      icon: iconMap[type] || 'Shield',
      color: colorMap[type] || 'blue',
    });

    // Log transaction for initial premium debit
    await Transaction.create({
      userId: req.user._id,
      title: `Initial Premium: ${newPolicy.title}`,
      category: 'Insurance',
      amount: premium,
      type: 'debit',
      date: new Date().toISOString().split('T')[0],
      account: checkingAcc.name,
      status: 'Completed',
    });

    // Create notification
    await Notification.create({
      userId: req.user._id,
      title: 'New Insurance Policy Issued! 🎉',
      text: `Policy #${policyId} for ${newPolicy.title} is now active. Auto-debit bound.`,
      time: 'Just now',
      unread: true,
    });

    res.status(201).json({
      success: true,
      message: 'Policy issued successfully.',
      data: {
        id: newPolicy.policyId,
        type: newPolicy.type,
        title: newPolicy.title,
        coverage: newPolicy.coverage,
        monthlyPremium: newPolicy.monthlyPremium,
        nextPaymentDate: newPolicy.nextPaymentDate,
        status: newPolicy.status,
        deductible: newPolicy.deductible,
        insuredSubject: newPolicy.insuredSubject,
        autoDebitAccount: newPolicy.autoDebitAccount,
        icon: newPolicy.icon,
        color: newPolicy.color,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
