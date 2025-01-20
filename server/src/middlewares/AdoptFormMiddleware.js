const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Pet = require('../models/Pets');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ error: 'Please authenticate' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);

            const user = await User.findById(decoded.id);
            console.log('Found user:', user ? 'yes' : 'no');

            if (!user) {
                console.log('User not found with id:', decoded.id);
                return res.status(404).json({ error: 'User not found' });
            }

            req.user = user;
            req.token = token;
            next();
        } catch (error) {
            console.log('Token verification error:', error);
            return res.status(401).json({ error: 'Invalid token' });
        }
    } catch (error) {
        console.log('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const validateAdoptForm = async (req, res, next) => {
    try {
        console.log('Validating adoption form:', {
            body: req.body,
            params: req.params,
            user: req.user?._id
        });

        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'contactNumber', 'occupation'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({ 
                error: `Missing required fields: ${missingFields.join(', ')}` 
            });
        }

        // Get pet and verify it exists
        const pet = await Pet.findById(req.params.petId);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        if (pet.status !== 'available') {
            return res.status(400).json({ error: 'Pet is not available for adoption' });
        }

        req.pet = pet;
        next();
    } catch (error) {
        console.error('Validation error:', error);
        res.status(500).json({ error: 'Server error during validation' });
    }
};

module.exports = { auth, validateAdoptForm };