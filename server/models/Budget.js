const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    monthlyLimit: { type: Number, required: true, default: 0 },
    spentAmount: { type: Number, required: true, default: 0 },
    remainingAmount: { type: Number, required: true, default: 0 },
    goalName: { type: String, default: 'Monthly Savings' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
