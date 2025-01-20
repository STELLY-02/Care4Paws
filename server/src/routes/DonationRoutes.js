const express = require("express");
const router = express.Router();
// const multer = require("multer");
const verifyToken = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

require("../models/DonationModel");
const Donation = mongoose.model("Donation");
const CoordinatorDetails = require("../models/CoordinatorDonationModel");

router.post("/donateUser", verifyToken, async (req, res) => {
  const { amount, paymentMethod, phoneNumber, coordinatorId } = req.body;

  // Validate input
  if (!amount || !paymentMethod || !coordinatorId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (amount <= 0) {
    return res
      .status(400)
      .json({ message: "Amount must be greater than zero" });
  }

  const validPaymentMethods = ["Online Banking", "Credit Card", "PayPal"];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: "Invalid payment method" });
  }

  try {
    // Fetch coordinator details
    const coordinatorDetails = await CoordinatorDetails.findById(coordinatorId);
    if (!coordinatorDetails) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    // Create donation
    const newDonation = new Donation({
      amount,
      paymentMethod,
      phoneNumber,
      postedBy: {
        id: req.user.id, // Link to the user by ID
        username: req.user.username, // Username of the user
      },
      coordinator: {
        id: coordinatorDetails._id,
        bankAccountNumber: coordinatorDetails.bankAccountNumber,
        bankType: coordinatorDetails.bankType,
        bankAccountName: coordinatorDetails.bankAccountName,
      },
    });

    const savedDonation = await newDonation.save();

    res.status(201).json({
      message: "Donation successfully created",
      donation: savedDonation,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error creating donation", error: err.message });
  }
});

router.get("/donationHistory", verifyToken, async (req, res) => {
  try {
    // Find donations by user ID
    const donations = await Donation.find({ "postedBy.id": req.user.id })
      .populate("coordinator.id", "bankAccountName") // Populate the coordinator details
      .sort({ createdAt: -1 }); // Sort by date, most recent first

    if (!donations || donations.length === 0) {
      return res.status(404).json({ message: "No donation history found" });
    }

    res.status(200).json(donations); // Send donation history to the client
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching donation history", error: err.message });
  }
});

router.get("/coordinatorHistory", verifyToken, async (req, res) => {
  try {
    // Fetch coordinator details based on authenticated user (assumes user is a coordinator)
    const coordinatorDetails = await CoordinatorDetails.findOne({
      coordinatorId: req.user.id, // Assuming req.user contains the authenticated user
    });
    console.log("Coordinator Details:", coordinatorDetails);

    if (!coordinatorDetails) {
      return res
        .status(404)
        .json({ message: "Coordinator details not found." });
    }

    // Fetch donations made to this coordinator (filtered by coordinator's ID)
    const donations = await Donation.find({
      "coordinator.id": coordinatorDetails._id, // Reference to the coordinator in the Donation model
    }).populate("postedBy.id", "username"); // Optionally populate donor's username

    res.json(donations); // Send the donation data as response
  } catch (error) {
    console.error(
      "Error fetching coordinator donation history:",
      error.message
    );
    res.status(500).json({ message: "Error fetching donation history." });
  }
});

module.exports = router;
