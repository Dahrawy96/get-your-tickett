const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getApprovedEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  updateStatus
} = require('../controllers/eventController');

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');
const authenticationMiddleware = require('../middleware/authenticationMiddleware'); // 🍪 Cookie-based
const authorizationMiddleware = require('../middleware/authorizationMiddleware');   // 🍪 Cookie-based

// ✅ Validation middleware for event creation & update
const validateEventFields = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('ticketPrice').isFloat({ gt: 0 }).withMessage('Ticket price must be a positive number'),
  body('totalTickets').isInt({ gt: 0 }).withMessage('Total tickets must be a positive integer'),
];

// ✅ Public route - Anyone can view approved events
router.get('/', getApprovedEvents);

// 🔐 Organizer-only routes
router.post(
  '/',
  validateEventFields,
  verifyToken,
  authorizeRoles('organizer'),
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  createEvent
);

router.put(
  '/:id',
  validateEventFields,
  verifyToken,
  authorizeRoles('organizer'),
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  updateEvent
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('organizer'),
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  deleteEvent
);

router.get(
  '/analytics/me',
  verifyToken,
  authorizeRoles('organizer'),
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  getEventAnalytics
);

// 🔐 Admin-only route to approve/decline events
router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('admin'),
  authenticationMiddleware,
  authorizationMiddleware(['admin']),
  updateStatus
);

module.exports = router;
