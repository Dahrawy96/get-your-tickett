const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');

// ✅ Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Protected routes
router.get('/', verifyToken, authorizeRoles('admin'), getAllUsers);
router.get('/me', verifyToken, (req, res) => res.status(200).json({ user: req.user }));
router.get('/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), getUser);
router.put('/:id', verifyToken, authorizeRoles('admin', 'user', 'organizer'), updateUser);
router.delete('/:id', verifyToken, authorizeRoles('admin', 'organizer'), deleteUser);

module.exports = router;
