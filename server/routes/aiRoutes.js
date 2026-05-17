const express = require('express');
const multer = require('multer');
const path = require('path');
const protect = require('../middleware/authMiddleware');
const { analyzeBill } = require('../controllers/aiController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
const upload = multer({
  storage,
  limits: { fileSize: 8_000_000 },
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) return cb(null, true);
    cb(new Error('Only JPG, PNG, and WEBP files are allowed'));
  },
});

const router = express.Router();
router.use(protect);
router.post('/analyze-bill', upload.single('receipt'), analyzeBill);

module.exports = router;
