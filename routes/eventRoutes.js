const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
<<<<<<< HEAD
  getApprovedEvents,
=======
  getEvents,
  getApprovedEvents,
  getEventById,
  getMyEvents,
>>>>>>> dahrawy
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  updateStatus
<<<<<<< HEAD
} = require('../controllers/eventController');

const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

// ✅ Validation middleware for event creation & update
const validateEventFields = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid ISO date is required'),
=======
} = require("../controllers/eventController");

const { verifyToken, authorizeRoles } = require('../middleware/authorMiddleware');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');
const authorizationMiddleware = require('../middleware/authorizationMiddleware');

const validateEventFields = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
>>>>>>> dahrawy
  body('location').notEmpty().withMessage('Location is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('ticketPrice').isFloat({ gt: 0 }).withMessage('Ticket price must be a positive number'),
  body('totalTickets').isInt({ gt: 0 }).withMessage('Total tickets must be a positive integer'),
];

<<<<<<< HEAD
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
=======
// View all approved events (Public)
router.get('/events', getApprovedEvents);

// Create new event (Organizer )
router.post(
  '/events',
  validateEventFields,
  verifyToken,
  authorizeRoles('organizer'),
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  createEvent
);

// Update an event by ID (Organizer )
router.put(
  '/events/:id',
  validateEventFields,
  verifyToken,
  authorizeRoles('organizer'),
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  updateEvent
);

// Delete an event by ID (Organizer )
router.delete(
  '/events/:id',
  verifyToken,
  authorizeRoles('organizer'),
>>>>>>> dahrawy
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  deleteEvent
);

<<<<<<< HEAD
router.get(
  '/analytics/me',
=======
// View analytics for organizer's events
router.get(
  '/users/events/analytics',
  verifyToken,
  authorizeRoles('organizer'),
>>>>>>> dahrawy
  authenticationMiddleware,
  authorizationMiddleware(['organizer']),
  getEventAnalytics
);

<<<<<<< HEAD
// 🔐 Admin-only route to approve/decline events
router.patch(
  '/:id/status',
=======
// Approve or decline event (Admin )
router.patch(
  '/:id/status',
  verifyToken,
  authorizeRoles('admin'),
>>>>>>> dahrawy
  authenticationMiddleware,
  authorizationMiddleware(['admin']),
  updateStatus
);

<<<<<<< HEAD
=======
// View events created by currently logged-in organizer
router.get(
  "/users/events",
  authenticationMiddleware,
  authorizationMiddleware(["organizer"]),
  getMyEvents
);

// View all events including pending/declined/approved (Admin )
router.get(
  "/events/all",
  authenticationMiddleware,
  authorizationMiddleware(["admin"]),
  getEvents
);

// Get a single event by ID (Public)
router.get("/events/:id", getEventById);

>>>>>>> dahrawy
module.exports = router;
