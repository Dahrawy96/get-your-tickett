const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  remainingTickets: {
    type: Number,
    required: true,
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating percentage of tickets booked
eventSchema.virtual('percentageBooked').get(function () {
  const booked = this.totalTickets - this.remainingTickets;
  return this.totalTickets === 0 ? 0 : Math.round((booked / this.totalTickets) * 100);
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

