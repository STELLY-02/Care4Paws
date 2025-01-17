const Pet = require('../models/Pets');

const addPet = async (req, res) => {
    try {
        // Debug logs
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('Request user:', req.user);

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'Photo is required' });
        }

        const petData = {
            name: req.body.name,
            age: Number(req.body.age),
            breed: req.body.breed,
            vaccinated: req.body.vaccinated === 'true',
            description: req.body.description,
            photo: `/uploads/${req.file.filename}`, // Store the path
            createdBy: req.user.id
        };

        console.log('Creating pet with data:', petData);

        const pet = new Pet(petData);
        const savedPet = await pet.save();

        console.log('Pet saved successfully:', savedPet);

        res.status(201).json({
            message: 'Pet added successfully',
            pet: savedPet
        });
    } catch (error) {
        console.error('Error adding pet:', error);
        res.status(500).json({ 
            error: 'Failed to add pet',
            details: error.message 
        });
    }
};

const getPets = async (req, res) => {
    try {
        const pets = await Pet.find().populate('createdBy', 'username role');
        res.json(pets);
    } catch (error) {
        console.error('Error getting pets:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addPet,
    getPets
};
