const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Get all user transactions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add Transaction
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    const newTx = new Transaction({
      userId: req.user.userId,
      title,
      amount,
      type,
      category,
      date
    });
    await newTx.save();
    res.status(201).json(newTx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Transaction
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTx = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!updatedTx) return res.status(404).json({ message: 'Transaction not found' });
    res.json(updatedTx);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Transaction
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTx = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!deletedTx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;