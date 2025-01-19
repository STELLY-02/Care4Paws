const AdoptForm = require('../models/AdoptFormModel');
const Pet = require('../models/Pets');
const Notification = require('../models/NotificationModel');

const submitAdoptForm = async (req, res) => {
    try {
        console.log('Submitting adoption form:', {
            body: req.body,
            petId: req.params.petId,
            userId: req.user._id
        });

        const { firstName, lastName, email, contactNumber, occupation } = req.body;

        // Get the pet and its coordinator
        const pet = await Pet.findById(req.params.petId)
            .populate('coordinator', 'username email _id');
            
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        // Log pet status for debugging
        console.log('Pet current status:', {
            petId: pet._id,
            name: pet.name,
            currentStatus: pet.status
        });

        // Check if pet is available for adoption
        if (pet.status !== 'available') {
            return res.status(400).json({ 
                error: `Pet is not available for adoption (Current status: ${pet.status})`
            });
        }

        console.log('Found pet with data:', pet);

        // Get the coordinator ID from either coordinator or createdBy field
        const coordinatorId = pet.coordinator?._id || pet.createdBy;
        if (!coordinatorId) {
            return res.status(400).json({ error: 'No coordinator assigned to this pet' });
        }

        // Check if user has already submitted a form for this pet
        const existingForm = await AdoptForm.findOne({
            petId: pet._id,
            userId: req.user._id
        });

        if (existingForm) {
            return res.status(400).json({ 
                error: 'You have already submitted an adoption form for this pet'
            });
        }

        console.log('Using coordinator ID:', coordinatorId);

        // Create adoption form with coordinator ID
        const adoptForm = new AdoptForm({
            petId: req.params.petId,
            userId: req.user._id,
            coordinatorId: coordinatorId,
            firstName,
            lastName,
            email,
            contactNumber,
            occupation,
            status: 'pending'
        });

        await adoptForm.save();

        // Update pet status
        pet.status = 'pending';
        await pet.save();

        res.status(201).json({
            message: 'Adoption form submitted successfully',
            adoptForm
        });
    } catch (error) {
        console.error('Error submitting adoption form:', error);
        res.status(500).json({ 
            error: 'Failed to submit adoption form',
            details: error.message,
            stack: error.stack
        });
    }
};

// Add new function to get adoption forms
const getAdoptionForms = async (req, res) => {
    try {
        console.log('Fetching adoption forms for coordinator:', req.user._id);

        // Find all adoption forms where coordinatorId matches the logged-in coordinator
        const adoptionForms = await AdoptForm.find({ coordinatorId: req.user._id })
            .populate('petId', 'name photo') // Get pet details
            .populate('userId', 'username email') // Get user details
            .sort({ createdAt: -1 }); // Most recent first

        console.log(`Found ${adoptionForms.length} adoption forms`);
        
        res.json(adoptionForms);
    } catch (error) {
        console.error('Error getting adoption forms:', error);
        res.status(500).json({ error: 'Error retrieving adoption forms' });
    }
};

const updateAdoptionStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const adoptForm = await AdoptForm.findById(requestId)
            .populate('userId')  // Add this to get user details
            .populate('petId');  // Add this to get pet details

        if (!adoptForm) {
            return res.status(404).json({ error: 'Adoption request not found' });
        }

        // Update adoption form status
        adoptForm.status = status;
        await adoptForm.save();

        // Create notification for the user
        const notification = new Notification({
            userId: adoptForm.userId._id,  // User who submitted the form
            title: `Adoption Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: status === 'approved' 
                ? `Congratulations! Your adoption request for ${adoptForm.petId.name} has been approved!`
                : `Your adoption request for ${adoptForm.petId.name} has been rejected.`,
            type: status === 'approved' ? 'success' : 'info'
        });

        await notification.save();
        console.log('Created notification:', notification); // Debug log

        // If approved, update pet status
        if (status === 'approved') {
            const pet = await Pet.findById(adoptForm.petId);
            if (pet) {
                pet.status = 'adopted';
                await pet.save();
            }
        }

        res.json({ 
            message: 'Status updated successfully', 
            adoptForm,
            notification 
        });
    } catch (error) {
        console.error('Error updating adoption status:', error);
        res.status(500).json({ error: 'Error updating status' });
    }
};

module.exports = {
    submitAdoptForm,
    getAdoptionForms,
    updateAdoptionStatus
};
