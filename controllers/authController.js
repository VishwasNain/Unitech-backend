const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabaseClient');
const { sendOTP, verifyOTP } = require('../utils/sendOTP');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hashedPassword }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'User registered', user: data[0] });
};

exports.sendOTPToEmail = async (req, res) => {
  const { email } = req.body;
  try {
    await sendOTP(email);
    res.json({ message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

exports.verifyOTPLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!verifyOTP(email, otp)) return res.status(401).json({ error: 'Invalid OTP' });

  const { data: users } = await supabase.from('users').select('*').eq('email', email).limit(1);
  if (!users || users.length === 0) return res.status(404).json({ error: 'User not found' });

  const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: users[0] });
};const bcrypt = require('bcryptjs');
const supabase = require('./supabaseClient');

async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password: hash }]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'User registered', user: data[0] });
}
const jwt = require('jsonwebtoken');

async function loginUser(req, res) {
  const { email, password } = req.body;

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error || users.length === 0) return res.status(400).json({ error: 'Invalid' });

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Wrong password' });

  await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user });
}
