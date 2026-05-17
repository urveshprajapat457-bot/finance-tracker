const fs = require('fs/promises');
const path = require('path');
const Transaction = require('../models/Transaction');
const { analyzeReceiptWithGemini, parseGeminiResponse } = require('../services/geminiService');

const buildReceiptPreview = (parsed, filename) => {
  const amount = parsed.totalAmount || parsed.items?.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const itemName = parsed.items?.length === 1 ? parsed.items[0].name : parsed.items?.length > 1 ? 'Multiple items' : parsed.shopName || 'Receipt purchase';
  const notes = parsed.items?.length > 1 ? parsed.items.map((item) => `${item.name} - ₹${item.price}`).join('\n') : parsed.notes || '';

  return {
    itemName,
    shopName: parsed.shopName || '',
    category: parsed.category || 'Shopping',
    amount: amount || 0,
    purchaseDate: parsed.purchaseDate || new Date().toISOString().slice(0, 10),
    notes,
    items: parsed.items || [],
    receiptImage: `/uploads/${filename}`,
    AIExtracted: true,
  };
};

exports.analyzeBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Receipt image is required' });
    }

    const filePath = path.join(req.file.destination, req.file.filename);
    const imageBuffer = await fs.readFile(filePath);

    const geminiResponse = await analyzeReceiptWithGemini(imageBuffer, req.file.mimetype);
    const parsed = parseGeminiResponse(geminiResponse);
    const extracted = buildReceiptPreview(parsed, req.file.filename);

    const possibleDuplicate = await Transaction.findOne({
      userId: req.user._id,
      shopName: extracted.shopName,
      amount: extracted.amount,
      purchaseDate: new Date(extracted.purchaseDate),
      AIExtracted: true,
    });

    return res.json({
      extracted,
      duplicate: Boolean(possibleDuplicate),
      insights: parsed.insights || [],
    });
  } catch (error) {
    console.error('AI receipt analysis error:', error);
    const detail = error.response?.data || error.message || 'Unknown error';
    return res.status(500).json({
      message: 'Unable to analyze receipt. Please try again.',
      detail,
    });
  }
};
