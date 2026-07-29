const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // e.g. 'POL-HLT-9921'
    policyId: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['Health', 'Auto', 'Home', 'Life'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    coverage: {
      type: Number,
      required: true,
    },
    monthlyPremium: {
      type: Number,
      required: true,
    },
    nextPaymentDate: {
      type: String,
      default: () => {
        const d = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return d.toISOString().split('T')[0];
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Expired', 'Pending'],
      default: 'Active',
    },
    deductible: {
      type: Number,
      default: 500,
    },
    // e.g. 'Alex Morgan + 1 Dependent' or '2024 Tesla Model Y'
    insuredSubject: {
      type: String,
      required: true,
    },
    autoDebitAccount: {
      type: String,
      default: 'Premier Checking (•••• 8892)',
    },
    icon: {
      type: String,
      default: 'Shield',
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
