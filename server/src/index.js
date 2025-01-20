const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');

//database connection
const dbConnect = require("./config/dbConnect");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const communityPostRoutes = require("./routes/communityPostRoutes");
const routeUpload = require('./routes/routeUpload');
const { generateStreamToken } = require('./middlewares/generateStreamToken');
const petRoutes = require("./routes/petRoutes");
const adoptFormRoutes = require('./routes/AdoptFormRoutes');
const educationPostRoutes = require("./routes/EducationPostRoutes");
const donationRoutes = require("./routes/DonationRoutes");
const coordinatorDonation = require("./routes/CoordinatorDonationRoutes");
const petReportRoutes = require("./routes/ReportPetRoutes");


dbConnect();

const app = express();

//Middleware
app.use(express.json()); //enable parsing of json
// app.use(express.json({ limit: '50mb' })); // Increase payload size limit
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(
    cors(
        {
        origin: "http://localhost:3000", // Allow requests from frontend
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed methods
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true, // Allow cookies if needed
    }
)
);


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
app.use("/api/uploadPic", routeUpload); //handling upload image
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/pets", petRoutes);
app.use('/api/adopt', adoptFormRoutes);
app.use("/api/educationPost", educationPostRoutes); // Use the new route for education posts
app.use("/api/donation", donationRoutes);
app.use("/api/coordinatorDonation", coordinatorDonation);
app.use("/api", petReportRoutes);

app.use((req, res, next) => {
    console.log('Request:', {
        method: req.method,
        path: req.path,
        headers: req.headers
    });
    next();
});

app.get('/',(req,res)=>{
    res.send('Welcome to Care4Paws')
})
app.post('/api/stream-token', generateStreamToken);

//Start the server
const PORT = process.env.PORT || 8085;
app.listen(PORT, ()=> {
    console.log(`Server is running at port ${PORT}`);
})