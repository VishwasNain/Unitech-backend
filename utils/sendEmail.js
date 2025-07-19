const nodemailer = require('nodemailer');
const ErrorResponse = require('./errorResponse');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: `Unitech <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html: options.html (you can also send HTML emails)
  };

  // 3) Actually send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email sending error:', err);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
