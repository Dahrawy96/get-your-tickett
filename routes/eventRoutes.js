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

const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// ✅ Validation middleware for event creation & update
const validateEventFields = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid ISO date is required'),
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
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  validateEventFields,
  createEvent
);

router.put(
  '/:id',
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  validateEventFields,
  updateEvent
);

router.delete(
  '/:id',
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  deleteEvent
);

router.get(
  '/analytics/me',
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  getEventAnalytics
);

// 🔐 Admin-only route to approve/decline events
router.patch(
  '/:id/status',
  authenticationMiddleware,
  authorizationMiddleware(['admin']),
  updateStatus
);

module.exports = router;
