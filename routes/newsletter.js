const express = require('express');
const {
  subscribe,
  unsubscribe,
  getSubscribers,
  getSubscriberCount
} = require('../controllers/newsletterController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Newsletter = require('../models/Newsletter');

// Public routes
router.post('/subscribe', subscribe);
router.put('/unsubscribe', unsubscribe);

// Admin routes
router.get(
  '/subscribers',
  protect,
  authorize('admin'),
  advancedResults(Newsletter),
  getSubscribers
);

router.get(
  '/subscribers/count',
  protect,
  authorize('admin'),
  getSubscriberCount
);

module.exports = router;
