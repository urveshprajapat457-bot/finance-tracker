const express = require('express');
const protect = require('../middleware/authMiddleware');
const { transactionValidation } = require('../validators/transactionValidator');
const validateRequest = require('../utils/validateRequest');
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

const router = express.Router();

router.use(protect);
router.route('/').post(transactionValidation, validateRequest, createTransaction).get(getTransactions);
router.route('/:id').get(getTransactionById).put(transactionValidation, validateRequest, updateTransaction).delete(deleteTransaction);

module.exports = router;
