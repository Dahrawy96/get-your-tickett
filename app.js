const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

<<<<<<< HEAD
// Initialize Express app
=======

>>>>>>> dahrawy
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

<<<<<<< HEAD
// Import routes
=======
>>>>>>> dahrawy
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

<<<<<<< HEAD
// Mount routes
app.use('/api/users', userRoutes);       // User-related routes
app.use('/api/events', eventRoutes);     // Event-related routes
app.use('/api/bookings', bookingRoutes); // Booking routes (auth handled per route)

// Default test route
app.get('/', (req, res) => {
  res.send('🎉 API is running...');
=======

app.use('/api/v1', eventRoutes);    
app.use('/api/v1', bookingRoutes); 
app.use('/api/v1', userRoutes);      

// bagarab hagaaaaaaaaaaaa
app.get('/', (req, res) => {
  res.send('API is running...');
>>>>>>> dahrawy
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
<<<<<<< HEAD
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
=======
  console.log(`Server running on http://localhost:${PORT}`);
});
>>>>>>> dahrawy
