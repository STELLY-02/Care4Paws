/*define endpoints based on role*/

const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();
const mongoose = require('mongoose')
require("../models/userModel");
const User = mongoose.model("User");

//Only admin can access this router
router.get("/admin", verifyToken, authorizeRoles("admin"), (req,res) => {
    res.json({message: "Welcome Admin"});
});

//Only admin and coordinator can access this router
router.get("/coordinator", verifyToken, authorizeRoles("coordinator"), (req,res) => {
    res.json({message: "Welcome Coordinator"});
});

//Only admin and user can access this router
router.get("/user", verifyToken, authorizeRoles("user"), (req,res) => {
    res.json({message: "Welcome User"});
});

router.post('/:userId/follow', async (req, res) => {
    try {
      const { userId } = req.params;
      const { followerId } = req.body;
  
      const user = await User.findById(userId);
      const follower = await User.findById(followerId);
  
      if (!user || !follower) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.following.includes(followerId)) {
        return res.status(400).json({ message: 'User is already followed' });
      }
  
      user.following.push(followerId);
      await user.save();
  
      res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
      console.error("Error following user:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  router.post('/:userId/unfollow', async (req, res) => {
    try {
      const { userId } = req.params;
      const { followerId } = req.body;
  
      const user = await User.findById(userId);
      const follower = await User.findById(followerId);
  
      if (!user || !follower) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.following = user.following.filter(id => id.toString() !== followerId);
      await user.save();
  
      res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

  router.get('/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate('following', 'username avatar description');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

module.exports = router;