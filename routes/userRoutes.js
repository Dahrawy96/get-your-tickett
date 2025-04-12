const express = require('express');
const router = express.Router();

// ✅ Import both controllers correctly
const { registerUser, loginUser } = require('../controllers/userController');

// ✅ Define the routes
router.post('/register', registerUser);
router.post('/login', loginUser); // <- this will break if loginUser is undefined

module.exports = router;
