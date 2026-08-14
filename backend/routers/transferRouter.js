const express = require('express');
const router = express.Router();
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * POST /api/transfer
 * Body: {
 *   fromAccId,       // accountId of source account e.g. 'chk-1'
 *   toAccId,         // accountId of dest (internal transfer) — null for external
 *   recipientName,   // required for external transfer
 *   recipientAccount,// required for external transfer
 *   amount,          // number
 *   note             // optional string
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { fromAccId, toAccId, recipientName, recipientAccount, amount, note } = req.body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid transfer amount.' });
    }

    // Load source account
    const sourceAcc = await Account.findOne({ accountId: fromAccId, userId: req.user._id });
    if (!sourceAcc) {
      return res.status(404).json({ success: false, message: 'Source account not found.' });
    }

    // Balance check (credit accounts can go over — they represent spend)
    if (sourceAcc.type !== 'credit' && sourceAcc.balance < numAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient funds in selected account.' });
    }

    // External transfer validation
    if (!toAccId && (!recipientName || !recipientAccount)) {
      return res.status(400).json({
        success: false,
        message: 'Recipient name and account number are required for external transfers.',
      });
    }

    // Debit source account
    if (sourceAcc.type === 'credit') {
      sourceAcc.balance += numAmount; // credit card balance increases on spend
    } else {
      sourceAcc.balance -= numAmount;
    }
    await sourceAcc.save();

    // Credit destination account (internal only)
    let destName = recipientName || recipientAccount || 'External Payee';
    if (toAccId) {
      const destAcc = await Account.findOne({ accountId: toAccId, userId: req.user._id });
      if (destAcc) {
        destName = destAcc.name;
        if (destAcc.type === 'credit') {
          destAcc.balance = Math.max(0, destAcc.balance - numAmount);
        } else {
          destAcc.balance += numAmount;
        }
        await destAcc.save();
      }
    }

    // Create transaction log entry
    const txTitle = `Transfer to ${destName}${note ? ` (${note})` : ''}`;
    const newTx = await Transaction.create({
      userId: req.user._id,
      title: txTitle,
      category: 'Transfer',
      amount: numAmount,
      type: 'debit',
      date: new Date().toISOString().split('T')[0],
      account: sourceAcc.name,
      status: 'Completed',
    });

    // Create notification
    const newNotif = await Notification.create({
      userId: req.user._id,
      title: 'Money Transferred',
      text: `Successfully sent ${sourceAcc.currency}${numAmount.toFixed(2)} to ${destName}.`,
      time: 'Just now',
      unread: true,
    });

    res.status(200).json({
      success: true,
      message: 'Transfer processed instantly.',
      data: {
        transaction: newTx,
        notification: newNotif,
        updatedSourceBalance: sourceAcc.balance,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
