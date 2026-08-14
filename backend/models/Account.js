const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // e.g. 'chk-1', 'sav-1', 'crd-1' — kept for frontend compatibility
    accountId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // Masked display number e.g. '•••• 8892'
    accountNumber: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['checking', 'savings', 'credit'],
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: '$',
    },
    // Savings APY e.g. '4.85%'
    apy: {
      type: String,
      default: null,
    },
    // Credit card limit
    creditLimit: {
      type: Number,
      default: null,
    },
    // Credit card due date
    dueDate: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: 'Landmark',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
