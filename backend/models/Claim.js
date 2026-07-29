const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // e.g. 'CLM-8821'
    claimId: {
      type: String,
      required: true,
      unique: true,
    },
    policyId: {
      type: String,
      required: true,
    },
    policyTitle: {
      type: String,
      required: true,
    },
    claimType: {
      type: String,
      required: true,
    },
    incidentDate: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'Submitted & Under Review',
        'Under Assessment',
        'Inspector Approved',
        'Payout Disbursed',
      ],
      default: 'Submitted & Under Review',
    },
    // 1: Submitted, 2: Under Assessment, 3: Approved, 4: Disbursed
    step: {
      type: Number,
      min: 1,
      max: 4,
      default: 1,
    },
    description: {
      type: String,
      required: true,
    },
    payoutAccount: {
      type: String,
      default: 'Premier Checking (•••• 8892)',
    },
    submittedDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
