const express = require('express');
const router = express.Router();
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const Notification = require('../models/Notification');
const User = require('../models/User');

// GET /api/claims — returns all claims for the demo user
router.get('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Run /api/seed first.' });
    }

    const claims = await Claim.find({ userId: user._id }).sort({ createdAt: -1 });

    // Map to frontend-compatible shape (use claimId as id)
    const mapped = claims.map((c) => ({
      id: c.claimId,
      policyId: c.policyId,
      policyTitle: c.policyTitle,
      claimType: c.claimType,
      incidentDate: c.incidentDate,
      amount: c.amount,
      status: c.status,
      step: c.step,
      description: c.description,
      payoutAccount: c.payoutAccount,
      submittedDate: c.submittedDate,
    }));

    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/claims — file a new insurance claim
 * Body: {
 *   policyId,
 *   claimType,
 *   incidentDate,
 *   amount,
 *   description
 * }
 */
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const { policyId, claimType, incidentDate, amount, description } = req.body;
    if (!policyId || !claimType || !incidentDate || !amount || !description) {
      return res.status(400).json({
        success: false,
        message: 'policyId, claimType, incidentDate, amount, and description are required.',
      });
    }

    const claimAmount = parseFloat(amount);
    if (isNaN(claimAmount) || claimAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid claim amount.' });
    }

    // Look up policy title
    const policy = await Policy.findOne({ policyId, userId: user._id });
    if (!policy) {
      return res.status(404).json({ success: false, message: 'Policy not found for this user.' });
    }

    // Generate unique claim ID e.g. 'CLM-8821'
    const claimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;

    const newClaim = await Claim.create({
      userId: user._id,
      claimId,
      policyId,
      policyTitle: policy.title,
      claimType,
      incidentDate,
      amount: claimAmount,
      status: 'Submitted & Under Review',
      step: 1,
      description,
      payoutAccount: `${policy.autoDebitAccount}`,
      submittedDate: new Date().toISOString().split('T')[0],
    });

    // Create notification
    await Notification.create({
      userId: user._id,
      title: 'Claim Submitted Successfully',
      text: `Claim #${claimId} of $${claimAmount.toFixed(2)} is received & assigned to adjuster.`,
      time: 'Just now',
      unread: true,
    });

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully.',
      data: {
        id: newClaim.claimId,
        policyId: newClaim.policyId,
        policyTitle: newClaim.policyTitle,
        claimType: newClaim.claimType,
        incidentDate: newClaim.incidentDate,
        amount: newClaim.amount,
        status: newClaim.status,
        step: newClaim.step,
        description: newClaim.description,
        payoutAccount: newClaim.payoutAccount,
        submittedDate: newClaim.submittedDate,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/claims/:claimId/step — admin: advance claim step
router.put('/:claimId/step', async (req, res) => {
  try {
    const { step, status } = req.body;
    const claim = await Claim.findOne({ claimId: req.params.claimId });
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found.' });
    }

    if (step !== undefined) claim.step = Math.min(4, Math.max(1, parseInt(step)));
    if (status !== undefined) claim.status = status;

    await claim.save();
    res.json({ success: true, data: claim });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
