const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddleware");
const mongoose = require("mongoose");

require("../models/CoordinatorDonationModel");
const CoordinatorDetails = mongoose.model("CoordinatorDonationDetails");

router.post("/donateDetailsC", verifyToken, async (req, res) => {
  const { bankAccountNumber, bankType, bankAccountName } = req.body;

  // Validate input
  if (!bankAccountNumber || !bankType || !bankAccountName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if coordinator details already exist for the logged-in user
    const existingDetails = await CoordinatorDetails.findOne({
      coordinatorId: req.user.id,
    });

    if (existingDetails) {
      return res.status(400).json({
        message:
          "Coordinator donation details already exist. Please clear them before creating new ones.",
      });
    }

    // Create a new coordinator details document
    const newCoordinatorDetails = new CoordinatorDetails({
      coordinatorId: req.user.id, // User ID from JWT (the coordinator)
      bankAccountNumber,
      bankType,
      bankAccountName,
    });

    // Save the coordinator details to the database
    const savedDetails = await newCoordinatorDetails.save();

    res.status(201).json({
      message: "Coordinator details created successfully",
      coordinator: savedDetails,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Coordinator donation details already exist.",
      });
    }

    res.status(500).json({
      message: "Error saving coordinator details",
      error: err.message,
    });
  }
});

// router.delete("/deleteDonateDetailsC", verifyToken, async (req, res) => {
//   try {
//     const deletedDetails = await CoordinatorDetails.findOneAndDelete({
//       coordinatorId: req.user.id,
//     });

//     if (!deletedDetails) {
//       return res.status(404).json({
//         message: "No donation details found to delete.",
//       });
//     }

//     res.status(200).json({
//       message: "Coordinator donation details cleared successfully.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: "Error clearing donation details",
//       error: err.message,
//     });
//   }
// });

router.get("/all", verifyToken, async (req, res) => {
  try {
    const coordinators = await CoordinatorDetails.find().select(
      "bankAccountNumber bankType bankAccountName"
    );

    if (!coordinators || coordinators.length === 0) {
      return res.status(404).json({ message: "No coordinators found" });
    }

    res.status(200).json({ coordinators });
  } catch (err) {
    console.error("Error fetching coordinators:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching coordinators", error: err.message });
  }
});

router.get("/Cdetails", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming verifyToken adds `user` to the request

    const coordinator = await CoordinatorDetails.findOne({
      coordinatorId: userId, // Use coordinatorId to match the user's ID
    }).select("bankAccountNumber bankType bankAccountName");

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator details not found" });
    }

    res.status(200).json({ coordinator });
  } catch (err) {
    console.error("Error fetching coordinator details:", err.message);
    res.status(500).json({
      message: "Error fetching coordinator details",
      error: err.message,
    });
  }
});

module.exports = router;
