const { body } = require('express-validator');

exports.transactionValidation = [
  body('itemName').trim().notEmpty().withMessage('Item name is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be greater than zero'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('shopName').trim().notEmpty().withMessage('Shop/Mart name is required'),
  body('paymentMethod')
    .isIn(['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer'])
    .withMessage('Select a valid payment method'),
  body('purchaseDate').isISO8601().withMessage('Valid purchase date is required'),
  body('notes').trim().optional(),
];
