const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const {
  bookTickets,
  cancelBooking,
  getMyBookings,
  getBookingById // ✅ Add this
} = require('../controllers/bookingController');

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');
const authenticationMiddleware = require('../middleware/authenticationMiddleware'); // 🍪
const authorizationMiddleware = require('../middleware/authorizationMiddleware');   // 🍪

// 🟢 Book tickets (validated)
router.post(
  '/',
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

// 🔵 View own bookings
router.get(
  '/my',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  getMyBookings
);

// 🔴 Cancel a booking
router.delete(
  '/:bookingId',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  [
    param('bookingId').isMongoId().withMessage('Invalid booking ID')
  ],
  cancelBooking
);

// 📄 Get booking details by ID
router.get(
  '/:bookingId',
  verifyToken,
  authorizeRoles('user'),
  authenticationMiddleware,
  authorizationMiddleware(['user']),
  [
    param('bookingId').isMongoId().withMessage('Invalid booking ID')
  ],
  getBookingById
);

module.exports = router;
