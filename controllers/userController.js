const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// REGISTER a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user' // default role
    });

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// LOGIN user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// GET all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single user
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE user profile
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const currentUser = req.user;

    // ⛔ Prevent normal users from editing others' profiles
    if (currentUser.id !== userId && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    // 🧹 Sanitize: prevent non-admins from updating their role
    if (req.body.role && currentUser.role !== 'admin') {
      delete req.body.role;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    return res.status(200).json({
      user: updatedUser,
      message: 'User updated successfully',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all functions
module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser
};
