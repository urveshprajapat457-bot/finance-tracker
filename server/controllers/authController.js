const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResetEmail } = require('../services/emailService');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateResetToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET, { expiresIn: '15m' });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, profileImage: user.profileImage },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, profileImage: user.profileImage },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('[Auth Controller] Forgot password requested for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('[Auth Controller] No user found for email:', email);
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const token = generateResetToken(user._id);
    await sendResetEmail(user, token);

    res.json({ message: 'Password reset link sent. Please check your email.' });
  } catch (error) {
    console.error('[Auth Controller] Forgot password error:', error);
    res.status(500).json({ message: 'Unable to send reset email at this time. Try again later.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    res.json({ message: 'Your password has been reset successfully' });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired. Request a new link.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid reset token. Please request a new password reset.' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentUser = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name || user.name;
    user.email = email || user.email;
    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }
    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
