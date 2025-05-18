const Event = require('../models/Event');
const Booking = require('../models/bookingModel'); // For analytics
const { validationResult } = require('express-validator');

//  View Approved Events (Public)
exports.getApprovedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'approved' });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};

// Create Event (Organizer)
exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, location, category, ticketPrice, totalTickets } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      ticketPrice,
      totalTickets,
      remainingTickets: totalTickets,
      organizer: req.user.id,
      status: 'pending',
    });
    


    await event.save();
    res.status(201).json({ message: 'Event created and pending approval', event });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};

//  Update Event (Organizer)
exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this event' });
    }

    const allowedUpdates = (({
      date,
      location,
      totalTickets,
      ticketPrice,
      category,
      remainingTickets
    }) => ({
      date,
      location,
      totalTickets,
      ticketPrice,
      category,
      remainingTickets
    }))(req.body);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true }
    );

    res.status(200).json({ message: 'Event updated', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err.message });
  }
};


// Delete Event (Organizer)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this event' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
};

//  Analytics (Organizer)
exports.getEventAnalytics = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });

    const analytics = await Promise.all(
      events.map(async (event) => {
        const bookings = await Booking.find({ event: event._id });
        const totalBooked = bookings.reduce((sum, b) => sum + b.quantity, 0);
        const percentBooked = ((totalBooked / event.totalTickets) * 100).toFixed(2);

        return {
          eventId: event._id,
          title: event.title,
          percentageBooked: `${percentBooked}%`
        };
      })
    );

    res.status(200).json({ analytics });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics', error: err.message });
  }
};

//  Admin Approve/Decline Event
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['approved', 'declined'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: `Event ${status}`, event });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event status', error: err.message });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your events", error: err.message });
  }
};


exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Return all events
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all events", error: err.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Error fetching event", error: err.message });
  }
};


