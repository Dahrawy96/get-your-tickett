const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  registerUser,
  loginUser,
  forgetPassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');

<<<<<<< HEAD
// ✅ Validation Rules
=======
// Validation rules for register
>>>>>>> dahrawy
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

<<<<<<< HEAD
=======
// Validation rules for login
>>>>>>> dahrawy
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

<<<<<<< HEAD
=======
// Validation rules for forget password
>>>>>>> dahrawy
const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

<<<<<<< HEAD
// ✅ Public routes
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.put('/forgetPassword', forgetPasswordValidation, forgetPassword);

// ✅ Protected routes
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);
router.get('/me', verifyToken, (req, res) => res.status(200).json({ user: req.user }));
router.get('/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), getUser);
router.put('/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), updateUser);
router.delete('/:id', verifyToken, authorizeRoles('admin', 'organizer'), deleteUser);
=======
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
router.get('/users/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), getUser);

// Update a user by ID
router.put('/users/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), updateUser);

// Delete a user by ID
router.delete('/users/:id', verifyToken, authorizeRoles('admin', 'organizer'), deleteUser);
>>>>>>> dahrawy

module.exports = router;
