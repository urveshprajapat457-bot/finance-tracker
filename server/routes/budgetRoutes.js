const express = require('express');
const protect = require('../middleware/authMiddleware');
const { budgetValidation } = require('../validators/budgetValidator');
const validateRequest = require('../utils/validateRequest');
const { setBudget, getBudget, updateBudget } = require('../controllers/budgetController');

const router = express.Router();
router.use(protect);
router.post('/', budgetValidation, validateRequest, setBudget);
router.get('/', getBudget);
router.put('/:id', budgetValidation, validateRequest, updateBudget);

module.exports = router;
