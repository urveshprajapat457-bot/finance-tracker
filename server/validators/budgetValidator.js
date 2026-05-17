const { body } = require('express-validator');

exports.budgetValidation = [
  body('monthlyLimit').isFloat({ gt: 0 }).withMessage('Monthly budget must be greater than zero'),
];
