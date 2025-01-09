const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communityPost',
      }],
  });

  module.exports = mongoose.model('Campaign', campaignSchema);