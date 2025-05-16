const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  registerUser,
  loginUser,
  forgetPassword,
  getAllUsers,
  getUserProfile,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');

// Validation rules for register
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Validation rules for forget password
const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Register a new user
router.post('/register', registerValidation, registerUser);

// Login a user
router.post('/login', loginValidation, loginUser);

// Update password (Forget password)
router.put('/forgetPassword', forgetPasswordValidation, forgetPassword);

// Get all users (Admin only)
router.get('/users', verifyToken, authorizeRoles('admin'), getAllUsers);

// Get current user's profile
router.get('/users/profile', verifyToken, (req, res) => res.status(200).json({ user: req.user }));

// Update current user's profile
router.put('/users/profile', verifyToken, updateUser);

// Get a user by ID
router.get('/users/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), getUserProfile);

// Update a user by ID
router.put('/users/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), updateUser);

// Delete a user by ID
router.delete('/users/:id', verifyToken, authorizeRoles('admin', 'organizer'), deleteUser);

module.exports = router;
