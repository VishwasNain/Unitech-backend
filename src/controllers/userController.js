import { query } from '../config/db.js';
import { ErrorResponse } from '../middleware/errorMiddleware.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, created_at FROM users');
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUser = async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Private/Admin
export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user exists
    const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (userExists.rows.length > 0) {
      return next(new ErrorResponse('User already exists', 400));
    }
    
    // In a real app, you would hash the password here
    const hashedPassword = password; // Replace with actual hashing
    
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  
  try {
    const result = await query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
    
    if (result.rows.length === 0) {
      return next(new ErrorResponse('User not found', 404));
    }
    
    res.json({ message: 'User removed' });
  } catch (error) {
    next(error);
  }
};
