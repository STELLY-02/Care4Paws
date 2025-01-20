/*define endpoints based on role*/

const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const router = express.Router();
const mongoose = require('mongoose')
require("../models/userModel");
const User = mongoose.model("User");
require('../models/NotificationModel');
const Notification = mongoose.model("Notification");

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

  router.get('/notifications', verifyToken, async (req, res) => {
    try {
        console.log('Notifications route hit');
        console.log('User from token:', req.user);
        console.log("usr Id ", req.user._id);

        const userId = new mongoose.Types.ObjectId(req.user._id);
        const notifications = await Notification.find({ 
          userId: userId, 
        }).sort({ createdAt: -1 });
        
        console.log('Found notifications:', notifications);
        res.json(notifications);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
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

  router.get('/profile/:userId', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.params.userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const profile = {
        avatarSrc: user.avatarSrc ? user.avatarSrc : null,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      };
  
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });

module.exports = router;