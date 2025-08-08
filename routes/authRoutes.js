const express = require('express');
const { register, sendOTPToEmail, verifyOTPLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/send-otp', sendOTPToEmail);
router.post('/verify-otp', verifyOTPLogin);

module.exports = router;