const express = require('express');
const mongoose = require('mongoose'); // ✅ fixed spelling here
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Connects to MongoDB

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
const userRoute = require('./routes/userRoutes');
app.use('/api/users', userRoute); // ✅ needs to come BEFORE app.listen

// Default test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
