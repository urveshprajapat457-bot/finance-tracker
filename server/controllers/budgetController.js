const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const recalcBudget = async (budget) => {
  const spentAmount = await Transaction.find({ userId: budget.userId, type: 'expense' }).then((records) => records.reduce((sum, item) => sum + item.amount, 0));
  budget.spentAmount = spentAmount;
  budget.remainingAmount = Math.max(0, budget.monthlyLimit - spentAmount);
  await budget.save();
  return budget;
};

exports.setBudget = async (req, res) => {
  try {
    const { monthlyLimit, goalName } = req.body;
    let budget = await Budget.findOne({ userId: req.user._id });
    if (!budget) {
      budget = new Budget({ userId: req.user._id, monthlyLimit, goalName });
    } else {
      budget.monthlyLimit = monthlyLimit;
      budget.goalName = goalName || budget.goalName;
    }
    await recalcBudget(budget);
    res.status(201).json({ message: 'Budget saved', budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user._id });
    if (!budget) {
      budget = await Budget.create({ userId: req.user._id, monthlyLimit: 0, spentAmount: 0, remainingAmount: 0 });
    }
    await recalcBudget(budget);
    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({ userId: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    budget.monthlyLimit = req.body.monthlyLimit || budget.monthlyLimit;
    budget.goalName = req.body.goalName || budget.goalName;
    await recalcBudget(budget);
    res.json({ message: 'Budget updated', budget });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
