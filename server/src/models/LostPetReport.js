const mongoose = require('mongoose');

const LostPetReportSchema = new mongoose.Schema({
  petName: { type: String, required: true },
  petAge: { type: Number, required: true },
  petGender: { type: String, required: true },
  petBreed: { type: String, required: true },
  petColor: { type: String, required: true },
  petType: { type: String, required: true },
  bodySize: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  reportType: { type: String, default: 'Lost' },
  postedBy: {
    id: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, required: true },
  },
  photo: {
    type: String,
    required: [true, 'Pet photo is required']
},
}, { timestamps: true });

module.exports = mongoose.model('LostPetReport', LostPetReportSchema);
