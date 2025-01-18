const Pet = require('../models/Pets');
const User = require('../models/userModel');

// Get all pets
const getPets = async (req, res) => {
    try {
        const pets = await Pet.find()
            .populate('coordinator', 'username email')
            .populate('adoptedBy', 'username');
        
        res.json(pets);
    } catch (error) {
        console.error('Error getting pets:', error);
        res.status(500).json({ error: error.message });
    }
};

// Add new pet (coordinators only)
const addPet = async (req, res) => {
    try {
        if (req.user.role !== 'coordinator') {
            return res.status(403).json({ error: 'Only coordinators can add pets' });
        }

        const petData = {
            ...req.body,
            coordinator: req.user._id,
            photo: `/uploads/${req.file.filename}`
        };

        const pet = new Pet(petData);
        await pet.save();

        res.status(201).json({
            message: 'Pet added successfully',
            pet: await pet.populate('coordinator', 'username email')
        });
    } catch (error) {
        console.error('Error adding pet:', error);
        res.status(400).json({ error: error.message });
    }
};

// Adopt a pet (users only)
const adoptPet = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ error: 'Only users can adopt pets' });
        }

        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ error: 'Pet not found' });
        }

        if (pet.status !== 'available') {
            return res.status(400).json({ error: 'Pet is not available for adoption' });
        }

        pet.status = 'adopted';
        pet.adoptedBy = req.user._id;
        await pet.save();

        // Add pet to user's adopted pets
        await User.findByIdAndUpdate(req.user._id, {
            $push: { adoptedPets: pet._id }
        });

        res.json({
            message: 'Pet adopted successfully',
            pet: await pet.populate(['coordinator', 'adoptedBy'])
        });
    } catch (error) {
        console.error('Error adopting pet:', error);
        res.status(400).json({ error: error.message });
    }
};

const createPet = async (req, res) => {
    try {
        const { name, age, breed, vaccinated, description, photo } = req.body;
        
        console.log('Creating pet with coordinator:', req.user._id);

        const pet = new Pet({
            name,
            age,
            breed,
            vaccinated,
            description,
            photo,
            createdBy: req.user._id,  // This sets the coordinator
            status: 'available'
        });

        console.log('New pet object:', pet);

        await pet.save();
        
        // Populate the coordinator details
        const populatedPet = await Pet.findById(pet._id)
            .populate('createdBy', 'username email');

        res.status(201).json(populatedPet);
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ error: 'Error creating pet' });
    }
};

module.exports = {
    getPets,
    addPet,
    adoptPet,
    createPet
};
