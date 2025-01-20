const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Ensure email format
        },
        password: {
            type: String,
            required: true,
            minlength: 8, 
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "coordinator", "user"],
        },
        username: {
            type: String,
            required: true,
            minlength: 3, 
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        avatarSrc:{
            type: String,
            default: "",
        },
        description:{
            type: String,
            //required: true,
        },
        following: {
            type: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
              },
            ],
            default: [], // Correctly placed default for following
          },
          adoptedPets: {
            type: [
              {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pet",
              },
            ],
            default: [], // Correctly placed default for adoptedPets
          },
        },
        {
          timestamps: true,
        }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
