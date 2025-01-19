const express = require("express");
const dotenv = require("dotenv");
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');

// Load environment variables before any other code
dotenv.config();

// Verify environment variables are loaded
console.log('MongoDB URI:', process.env.CONNECTION_STRING);

//database connection
const dbConnect = require("./config/dbConnect");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const communityPostRoutes = require("./routes/communityPostRoutes");
const petRoutes = require("./routes/petRoutes");
const adoptFormRoutes = require('./routes/AdoptFormRoutes');


dbConnect();

const app = express();

//Middleware
app.use(express.json()); //enable parsing of json

// Updated CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Explicitly handle preflight requests
app.options("*", (req, res) => {
    res.sendStatus(204); // Respond with no content
  });

// Increase the body size limit for JSON payloads
app.use(express.json({ limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Debug middleware
app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        path: req.path,
        headers: req.headers
    });
    next();
});

//Routes
app.use("/api/auth", authRoutes); //handling authentication, request to /api/auth send to authRoutes
app.use("/api/users", userRoutes); //handling users, users is the API endpoints
app.use("/api/communityPost", communityPostRoutes); //handling community module
app.use("/api/pets", petRoutes);
app.use('/api/adopt', adoptFormRoutes);

// Test root route
app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
});

//Mount user routes
app.use('/api/user', userRoutes);

//Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// 404 handler
app.use((req, res) => {
    console.log('404 for path:', req.path);
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path 
    });
});

//Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});

module.exports = app;