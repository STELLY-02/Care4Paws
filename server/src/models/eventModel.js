const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventPic: { type: String, required: true },
  eventTags: { type: [String], required: true },
  eventType: { type: String, required: true },
  eventStatus: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventLocation: { type: String, required: true },
  eventFee: { type: Number, default: 0, required: true },
  eventDescription: { type: String, required: true },
  eventOrganizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participantsCount: { type: Number, default: 0 },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;