const mongoose = require("mongoose");

// CoordinatorDetails Schema
const coordinatorDetailsSchema = new mongoose.Schema(
  {
    coordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (coordinator)
      required: true,
      unique: true,
    },
    bankAccountNumber: {
      type: String,
      required: true,
    },
    bankType: {
      type: String,
      required: true,
    },
    bankAccountName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model(
  "CoordinatorDonationDetails",
  coordinatorDetailsSchema
);
