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
        following: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }]
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
