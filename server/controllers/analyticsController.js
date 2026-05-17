const Transaction = require('../models/Transaction');

exports.getDashboardStats = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    const totalIncome = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    const savings = Math.max(0, balance * 0.18);
    const expenseCategories = transactions
      .filter((item) => item.type === 'expense')
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.amount;
        return acc;
      }, {});
    const categoryDistribution = Object.entries(expenseCategories).map(([category, amount]) => ({ category, amount }));
    const recentTransactions = transactions.slice(0, 6);
    const monthlyTrend = [];
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      const monthTransactions = transactions.filter((item) => item.date.getMonth() === date.getMonth() && item.date.getFullYear() === date.getFullYear());
      monthlyTrend.push({
        month: monthName,
        income: monthTransactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + item.amount, 0),
        expense: monthTransactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0),
      });
    }
    res.json({ totalIncome, totalExpense, balance, savings, categoryDistribution, monthlyTrend, recentTransactions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReports = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    const yearlyReport = {};
    const monthlyReport = {};
    transactions.forEach((item) => {
      const year = item.date.getFullYear();
      const month = item.date.toLocaleString('default', { month: 'short' });
      yearlyReport[year] = yearlyReport[year] || { income: 0, expense: 0 };
      monthlyReport[`${month} ${year}`] = monthlyReport[`${month} ${year}`] || { income: 0, expense: 0 };
      yearlyReport[year][item.type] += item.amount;
      monthlyReport[`${month} ${year}`][item.type] += item.amount;
    });
    res.json({ yearlyReport, monthlyReport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryAnalytics = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });
    const categoryTotals = transactions.reduce((acc, item) => {
      const key = `${item.type}-${item.category}`;
      acc[key] = acc[key] || { type: item.type, category: item.category, amount: 0 };
      acc[key].amount += item.amount;
      return acc;
    }, {});
    res.json({ categories: Object.values(categoryTotals) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
