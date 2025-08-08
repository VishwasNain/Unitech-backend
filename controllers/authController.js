const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const { sendOTP, verifyOTP } = require('../utils/sendOTP');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hash }])
      .select();
      
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// Send OTP to user's email
exports.sendOTPToEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = sendOTP(email);
    
    if (!otp) return res.status(400).json({ error: 'Failed to send OTP' });
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error sending OTP' });
  }
};

// Verify OTP for login
exports.verifyOTPLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!verifyOTP(email, otp)) {
      return res.status(401).json({ error: 'Invalid OTP' });
    }

    const { data: users } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);
      
    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: users[0] });
  } catch (error) {
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
};

// Login with email and password
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error || !users || users.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};
