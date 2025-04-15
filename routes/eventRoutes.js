const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventAnalytics,
  updateStatus,
} = require("../controllers/eventController");

const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

// ✅ Public route - Anyone can view events
router.get("/", getEvents);


// 🔐 Organizer-only routes
router.post("/", authenticationMiddleware, authorizationMiddleware(["organizer"]), createEvent);
router.put("/:id", authenticationMiddleware, authorizationMiddleware(["organizer"]), updateEvent);
router.delete("/:id", authenticationMiddleware, authorizationMiddleware(["organizer"]), deleteEvent);
router.get("/analytics/me", authenticationMiddleware, authorizationMiddleware(["organizer"]), getEventAnalytics);

// 🔐 Admin-only route to approve/decline events
router.patch("/:id/status", authenticationMiddleware, authorizationMiddleware(["admin"]), updateStatus);

module.exports = router;
