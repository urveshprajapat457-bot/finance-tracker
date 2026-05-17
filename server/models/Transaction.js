const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    itemName: { type: String, trim: true },
    title: { type: String, trim: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ['income', 'expense'] },
    category: { type: String, required: true, trim: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'],
    },
    shopName: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },
    receiptImage: { type: String, trim: true, default: '' },
    AIExtracted: { type: Boolean, default: false },
    date: { type: Date, required: true },
    purchaseDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
