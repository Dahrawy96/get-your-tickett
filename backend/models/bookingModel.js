const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'At least one ticket must be booked'],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price must be positive'],
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  }
});

// Export the Booking model
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
