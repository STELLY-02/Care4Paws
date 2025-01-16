const express = require("express");
const dotenv = require("dotenv");

// Load environment variables before any other code
dotenv.config();

// Verify environment variables are loaded
console.log('MongoDB URI:', process.env.CONNECTION_STRING);

const cors = require("cors");

//database connection
const dbConnect = require("./config/dbConnect");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const communityPostRoutes = require("./routes/communityPostRoutes");


dbConnect();

const app = express();

//Middleware
app.use(express.json()); //enable parsing of json

// Update CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost variations
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Explicitly handle preflight requests
app.options("*", (req, res) => {
    res.sendStatus(204); // Respond with no content
  });

// Increase the body size limit for JSON payloads
app.use(express.json({ limit: '10mb' }));

//Routes
app.use("/api/auth", authRoutes); //handling authentication, request to /api/auth send to authRoutes
app.use("/api/users", userRoutes); //handling users, users is the API endpoints
app.use("/api/communityPost", communityPostRoutes); //handling community module

app.get('/',(req,res)=>{
    res.send('Welcome to Care4Paws')
})

//Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});