const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
    try {
        const { email, password, role, username, avaterSrc, firstName, lastName, phoneNumber } = req.body;

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const passwordStrengthRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (!passwordStrengthRegex.test(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long, with at least one letter and one number.' });
        }

        if (!avatarSrc) {
            return res.status(400).json({ message: "Profile picture (avatarSrc) is required." });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role,
            username,
            firstName,
            lastName,
            phoneNumber,
            avaterSrc
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong', error: err.message });
    }
};



const login = async (req, res) => {
    try {
        console.log("Login attempt:", req.body); //log the credentials passed

        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found:", email); // Debug log
            return res.status(404).json({ message: `User with email ${email} not found` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password for user:", email); // Debug log
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        const userdata = await User.findById(user._id).select("-password");
        console.log("Authenticated user data:", userdata);
        res.status(200).json({ token, role: user.role, userId: user._id, username: userdata.username });
    } catch (err) {
        console.error("Login error:", err.message); // Debug log
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};


const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
};

module.exports = {
    register,
    login,
    logout
};
