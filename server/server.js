const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const aiRoutes = require('./routes/aiRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

console.log('[Server] EMAIL_USER set:', Boolean(process.env.EMAIL_USER));
console.log('[Server] CLIENT_URL set:', Boolean(process.env.CLIENT_URL));
console.log('[Server] JWT_SECRET set:', Boolean(process.env.JWT_SECRET));
console.log('[Server] JWT_RESET_SECRET set:', Boolean(process.env.JWT_RESET_SECRET));

if (!process.env.JWT_SECRET) {
  console.error(
    'Missing required environment variable JWT_SECRET. Copy server/.env.example to server/.env and set JWT_SECRET.'
  );
  process.exit(1);
}

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/budgets', budgetRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
