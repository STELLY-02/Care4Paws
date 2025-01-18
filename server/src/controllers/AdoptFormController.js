const AdoptForm = require('../models/AdoptFormModel');
const Pet = require('../models/Pets');

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

module.exports = {
    submitAdoptForm
};
