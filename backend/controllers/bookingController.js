const { validationResult } = require('express-validator');
const Booking = require('../models/bookingModel');
const Event = require('../models/Event');

// Book Tickets
const bookTickets = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { eventId, ticketsRequested } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event || event.status !== 'approved') {
      return res.status(404).json({ message: 'Event not found or not approved' });
    }

    if (event.remainingTickets < ticketsRequested) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const totalPrice = ticketsRequested * event.ticketPrice;

    const booking = new Booking({
      user: userId,
      event: eventId,
      quantity: ticketsRequested,
      totalPrice,
      bookedAt: new Date(),
    });

    await booking.save();
    event.remainingTickets -= ticketsRequested;
    await event.save();

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error booking tickets', error: error.message });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { bookingId } = req.params;
  const userId = req.user.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.user.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized or booking not found' });
    }

    const event = await Event.findById(booking.event);
    if (event) {
      event.remainingTickets += booking.quantity;
      await event.save();
    }

    await booking.deleteOne();

    res.status(200).json({ message: 'Booking cancelled and tickets refunded' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

//  View My Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate({
      path: 'event',
      select: 'title date location ticketPrice status',
    });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookings', error: error.message });
  }
};


// Get booking details by ID (for the logged-in user)
const getBookingById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId).populate('event');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure only the owner can view the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access to this booking' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking details', error: error.message });
  }
};


module.exports = {
  bookTickets,
  cancelBooking,
  getMyBookings,
  getBookingById 
};

