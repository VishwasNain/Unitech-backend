const mongoose = require('mongoose');
const validator = require('validator');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  isSubscribed: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  }
});

// Prevent duplicate emails
newsletterSchema.index({ email: 1 }, { unique: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
