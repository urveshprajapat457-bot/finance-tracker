const Transaction = require('../models/Transaction');
const User = require('../models/User');

const adjustTotals = async (userId) => {
  const transactions = await Transaction.find({ userId });
  const totalIncome = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
  await User.findByIdAndUpdate(userId, { totalIncome, totalExpense });
};

exports.createTransaction = async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user._id };
    if (!payload.title && payload.itemName) payload.title = payload.itemName;
    if (payload.purchaseDate && !payload.date) payload.date = payload.purchaseDate;
    if (payload.notes && !payload.description) payload.description = payload.notes;
    const transaction = await Transaction.create(payload);
    await adjustTotals(req.user._id);
    res.status(201).json({ message: 'Transaction created', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, type, category, paymentMethod, startDate, endDate, sort } = req.query;
    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (category) query.category = category;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      query.$or = [
        { title: regex },
        { itemName: regex },
        { shopName: regex },
        { description: regex },
      ];
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    let order = { createdAt: -1 };
    if (sort === 'oldest') order = { createdAt: 1 };
    if (sort === 'highest') order = { amount: -1 };
    if (sort === 'lowest') order = { amount: 1 };
    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort(order)
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10));
    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (!req.body.title && req.body.itemName) req.body.title = req.body.itemName;
    if (req.body.purchaseDate && !req.body.date) req.body.date = req.body.purchaseDate;
    if (req.body.notes && !req.body.description) req.body.description = req.body.notes;
    Object.assign(transaction, req.body);
    await transaction.save();
    await adjustTotals(req.user._id);
    res.json({ message: 'Transaction updated', transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    await adjustTotals(req.user._id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
