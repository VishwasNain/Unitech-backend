const nodemailer = require('nodemailer');
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOTP = async (email) => {
  const otp = generateOTP();
  otpStore.set(email, otp);

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is ${otp}`
  });

  return otp;
};

const verifyOTP = (email, otp) => {
  return otpStore.get(email) === otp;
};

module.exports = { sendOTP, verifyOTP };