const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Pet name is required']
    },
    age: {
        type: Number,
        required: [true, 'Pet age is required'],
        min: [0, 'Age cannot be negative']
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
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Pet must be created by a user']
    },
    status: {
        type: String,
        enum: ['available', 'adopted', 'pending'],
        default: 'available'
    },
    adoptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true,  // Adds createdAt and updatedAt fields
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

// Virtual for photo URL
petSchema.virtual('photoUrl').get(function() {
    if (this.photo) {
        return `/uploads/${this.photo}`;
    }
    return null;
});

// Pre-save middleware to ensure photo exists
petSchema.pre('save', function(next) {
    if (!this.photo) {
        next(new Error('Pet photo is required'));
    }
    next();
});

// Add indexes for better query performance
petSchema.index({ status: 1 });
petSchema.index({ createdBy: 1 });
petSchema.index({ adoptedBy: 1 });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;