const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  location: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  remainingTickets: { type: Number, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
