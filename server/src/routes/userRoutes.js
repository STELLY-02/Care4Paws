const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Notification = require('../models/NotificationModel');

// Basic test route - NO AUTH
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from user routes!' });
});

// Simple notifications route
router.get('/notifications', verifyToken, async (req, res) => {
    try {
        console.log('Notifications route hit');
        console.log('User from token:', req.user);

        const notifications = await Notification.find({ 
            userId: req.user._id 
        }).sort({ createdAt: -1 });
        
        console.log('Found notifications:', notifications);
        res.json(notifications);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

module.exports = router;