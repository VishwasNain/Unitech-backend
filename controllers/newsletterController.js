const Newsletter = require('../models/Newsletter');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Subscribe to newsletter
// @route   POST /api/v1/newsletter/subscribe
// @access  Public
exports.subscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Check if email already exists
  let subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

  if (subscriber) {
    // If already subscribed, update the subscription status
    if (subscriber.isSubscribed) {
      return next(new ErrorResponse('This email is already subscribed', 400));
    } else {
      subscriber.isSubscribed = true;
      subscriber.subscribedAt = Date.now();
      subscriber.unsubscribedAt = undefined;
      await subscriber.save();
      
      return res.status(200).json({
        success: true,
        message: 'Successfully resubscribed to newsletter',
        data: subscriber
      });
    }
  }

  // Create new subscription
  subscriber = await Newsletter.create({
    email: email.toLowerCase(),
    isSubscribed: true,
    subscribedAt: Date.now()
  });

  // In a real app, you might want to send a welcome email here

  res.status(201).json({
    success: true,
    message: 'Successfully subscribed to newsletter',
    data: subscriber
  });
});

// @desc    Unsubscribe from newsletter
// @route   PUT /api/v1/newsletter/unsubscribe
// @access  Public
exports.unsubscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

  if (!subscriber) {
    return next(new ErrorResponse('No subscription found with this email', 404));
  }

  if (!subscriber.isSubscribed) {
    return next(new ErrorResponse('This email is already unsubscribed', 400));
  }

  subscriber.isSubscribed = false;
  subscriber.unsubscribedAt = Date.now();
  await subscriber.save();

  res.status(200).json({
    success: true,
    message: 'Successfully unsubscribed from newsletter',
    data: {}
  });
});

// @desc    Get all subscribers (Admin)
// @route   GET /api/v1/newsletter/subscribers
// @access  Private/Admin
exports.getSubscribers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get subscriber count (Admin)
// @route   GET /api/v1/newsletter/subscribers/count
// @access  Private/Admin
exports.getSubscriberCount = asyncHandler(async (req, res, next) => {
  const count = await Newsletter.countDocuments({ isSubscribed: true });
  
  res.status(200).json({
    success: true,
    count
  });
});
