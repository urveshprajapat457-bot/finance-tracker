const express = require('express');
const protect = require('../middleware/authMiddleware');
const { getDashboardStats, getReports, getCategoryAnalytics } = require('../controllers/analyticsController');

const router = express.Router();
router.use(protect);
router.get('/dashboard', getDashboardStats);
router.get('/reports', getReports);
router.get('/categories', getCategoryAnalytics);

module.exports = router;
