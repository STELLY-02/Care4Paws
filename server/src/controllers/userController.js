const Notification = require('../models/NotificationModel');

const getNotifications = async (req, res) => {
    try {
        console.log('Getting notifications for user:', req.user);
        
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const notifications = await Notification.find({ 
            userId: req.user._id 
        }).sort({ createdAt: -1 });
        
        console.log('Found notifications:', notifications);
        res.json(notifications);
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

module.exports = {
    getNotifications
}; 