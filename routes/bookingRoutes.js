const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  bookTickets,
  cancelBooking,
  getMyBookings,
  getBookingById
} = require('../controllers/bookingController');

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// Create a new booking (Standard user )
router.post(
  '/bookings',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  [
    body('eventId').notEmpty().withMessage('Event ID is required'),
    body('ticketsRequested')
      .isInt({ min: 1 }).withMessage('Tickets requested must be a positive integer')
  ],
  bookTickets
);

// Get current user's bookings (Standard user )
router.get(
  '/users/bookings',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  getMyBookings
);

// Cancel a booking by ID (Standard user )
router.delete(
  '/bookings/:bookingId',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  [
    param('bookingId').isMongoId().withMessage('Invalid booking ID')
  ],
  cancelBooking
);

// Get a single booking by ID (Standard user )
router.get(
  '/bookings/:id',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  [
    param('id').isMongoId().withMessage('Invalid booking ID')
  ],
  getBookingById
);

module.exports = router;
