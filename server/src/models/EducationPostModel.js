// In educationPostModel.js
const mongoose = require("mongoose");

const educationPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      default: "no photo", // Default value for photo if none provided
    },
    postedBy: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      username: {
        type: String,
        required: true, // Username of the person who posted
      },
      role: {
        type: String,
        required: true, // Role of the person who posted (admin, coordinator, etc.)
      },
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("EducationPost", educationPostSchema);
