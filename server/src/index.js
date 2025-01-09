const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
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
app.use(express.json({ limit: '50mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allow cookies if needed
    })
); //enable CORS, handle request from diff origin (eg handle request from frontend)

// app.use(
//     cors({
//       origin: "*", // Allow all origins
//     })
//   );

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
const PORT = process.env.PORT || 8081;
app.listen(PORT, ()=> {
    console.log(`Server is running at port ${PORT}`);
})