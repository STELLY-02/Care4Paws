// In educationPostRoutes.js (or a similar file)
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const verifyToken = require("../middlewares/authMiddleware"); // Middleware to verify JWT token

// Import the EducationPost model
require("../models/EducationPostModel");
const EducationPost = mongoose.model("EducationPost");

// Create an education post
router.post("/create", verifyToken, (req, res) => {
  const { title, content, photo } = req.body; // Extract post data from request body

  // Validate and sanitize input if necessary
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }
  // Create a new education post
  const newPost = new EducationPost({
    title,
    content,
    photo: req.body.photo || "no photo", // Handle photo (optional)
    postedBy: {
      id: req.user.id, // The user ID from JWT
      username: req.user.username, // The username from JWT
      role: req.user.role, // The role from JWT
    },
  });

  newPost
    .save()
    .then((post) => {
      res
        .status(201)
        .json({ message: "Education post created successfully", post });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error creating education post", error: err.message });
    });
});

router.get("/educationContent", async (req, res) => {
  try {
    const posts = await EducationPost.find(); // Fetch all education posts
    res.status(200).json({
      message: "Fetched education posts successfully.",
      posts, // Return the posts
    });
  } catch (error) {
    console.error("Error fetching education posts:", error.message);
    res.status(500).json({
      error: "Failed to fetch education posts.",
      details: error.message,
    });
  }
});

router.get("/educationPost/:id", async (req, res) => {
  try {
    const post = await EducationPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error.message);
    res.status(500).json({ message: "Error fetching post" });
  }
});

router.delete("/delete/:postId", verifyToken, async (req, res) => {
  const { postId } = req.params;
  try {
    const deletedPost = await EducationPost.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
});

module.exports = router;
