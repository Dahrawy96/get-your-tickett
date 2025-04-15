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

// ✅ Validation Rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

const forgetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

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

module.exports = router;
