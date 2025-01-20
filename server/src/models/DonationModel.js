const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },
    postedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model (donor)
        required: true,
      },
      username: {
        type: String,
        required: true, // Username of the person who posted
      },
    },
    coordinator: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CoordinatorDonationDetails", // Reference to the CoordinatorDetails model
        required: true,
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
