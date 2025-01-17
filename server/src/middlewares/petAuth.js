const jwt = require('jsonwebtoken');
const User = require('../models/userModel');  // Updated import path to match your structure

const petAuth = async (req, res, next) => {
    try {
        // 1. Get and verify token
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // 2. Decode token and find user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // 3. Check if user is a coordinator
        if (user.role !== 'coordinator') {
            return res.status(403).json({ 
                error: 'Access denied. Only coordinators can manage pets' 
            });
        }

        // 4. Add user info to request
        req.user = {
            id: user._id,
            username: user.username,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };

        // Debug log
        console.log('Pet auth passed:', {
            userId: req.user.id,
            role: req.user.role,
            action: req.method,
            name: `${req.user.firstName} ${req.user.lastName}`
        });

        next();
    } catch (error) {
        console.error('Pet auth error:', error);
        res.status(401).json({ 
            error: 'Authentication failed',
            details: error.message 
        });
    }
};

module.exports = petAuth;
