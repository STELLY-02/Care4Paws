const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required']
    },
    age: {
        type: Number,
        required: [true, 'Pet age is required']
    },
    breed: {
        type: String,
        required: [true, 'Pet breed is required']
    },
    vaccinated: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: [true, 'Pet description is required']
    },
    photo: {
        type: String,
        required: [true, 'Pet photo is required']
    },
    status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available'
    },
    coordinator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Pet must have a coordinator']
    },
    adoptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Add index for better query performance
petSchema.index({ status: 1, coordinator: 1 });

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;