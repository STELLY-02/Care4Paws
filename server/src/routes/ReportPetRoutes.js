const express = require('express');
const mongoose = require('mongoose');
const verifyToken = require('../middlewares/authMiddleware');
const { findMatches } = require('../models/matches');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Import the separate models
const LostPetReport = require('../models/LostPetReport');
const FoundPetReport = require('../models/FoundPetReport');

// Initialize Express router
const router = express.Router();


// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'pet-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});
//const Notification = require('../models/Notification');

/**
 * Validate the request body for the pet report.
 * @param {Object} body - The request body.
 * @param {string} reportType - Type of report ('Lost' or 'Found').
 * @param {boolean} hasPhoto - Whether a photo is provided.
 * @returns {String|null} - Returns error message if invalid, null if valid.
 */
const validatePetReport = (body, file) => {
  const {
    reportType,
    petName,
    petAge,
    petGender,
    petBreed,
    petColor,
    petType,
    bodySize,
    location,
    description,
  } = body;

  // Check required fields
  if (!reportType || !petGender || !petBreed || !petColor || 
      !petType || !bodySize || !location || !description) {
    return 'All required fields must be provided.';
  }

  // Additional checks for Lost reports
  if (reportType === 'Lost' && (!petName || !petAge)) {
    return 'Pet Name and Pet Age are required for Lost reports.';
  }

  // Check if photo is provided
  if (!file) {
    return 'A photo of the pet is required.';
  }

  return null;
};


// POST route: Create a new pet report
router.post('/PetReport', verifyToken, upload.single('photo'), async (req, res) => {
  try {
    // Validate input with the file
    const validationError = validatePetReport(req.body, req.file);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Parse postedBy if it's a string
    let postedBy = req.body.postedBy;
    if (typeof postedBy === 'string') {
      try {
        postedBy = JSON.parse(postedBy);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid postedBy data format' });
      }
    }

    // Create the report object
    const reportData = {
      ...req.body,
      photo: `uploads/${req.file.filename}`,
      postedBy: postedBy || {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role,
      }
    };

    // Save based on report type
    const Report = reportData.reportType === 'Lost' ? LostPetReport : FoundPetReport;
    const newReport = new Report(reportData);
    const savedReport = await newReport.save();

    res.status(201).json({
      message: 'Pet report stored successfully.',
      petReport: savedReport
    });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({
      error: 'Failed to store pet report.',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});
// // GET route: Fetch all reports (Lost and Found)
// router.get('/PetReports', async (req, res) => {
//   try {
//     // Fetch both Lost and Found reports
//     const [lostReports, foundReports] = await Promise.all([
//       LostPetReport.find(),
//       FoundPetReport.find(),
//     ]);

//     // Return combined reports
//     res.status(200).json({
//       message: 'Fetched all pet reports successfully.',
//       reports: {
//         lostReports,
//         foundReports,
//       },
//     });
//   } catch (error) {
//     console.error('Error fetching pet reports:', error.message);
//     res.status(500).json({
//       error: 'Failed to fetch pet reports.',
//       details: error.message,
//     });
//   }
// });

// GET route: Fetch all reports
router.get('/PetReports', async (req, res) => {
  try {
    const lostReports = await LostPetReport.find();
    const foundReports = await FoundPetReport.find();
    res.status(200).json({
      message: 'Fetched pet reports successfully.',
      lostReports,
      foundReports,
    });
  } catch (error) {
    console.error('Error fetching pet reports:', error.message);
    res.status(500).json({ error: 'Failed to fetch pet reports.', details: error.message });
  }
});

router.get('/reports/user', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const reports = await LostPetReport.find({ 'postedBy.id': userId });

    res.status(200).json({
      message: 'Fetched user-specific lost reports successfully.',
      lostReports: reports,
    });
  } catch (err) {
    console.error('Error fetching lost pet reports:', err.message);
    res.status(500).json({ message: 'Failed to fetch lost pet reports.' });
  }
});

/**
 * Route to mark a lost report as found and delete it
 * @route DELETE /api/reports/:id/found
 */
router.delete('/reports/:id/found', verifyToken, async (req, res) => {
  const reportId = req.params.id;

  try {
    // Find the report by ID
    const report = await LostPetReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Lost pet report not found.' });
    }

    // Ensure the user owns the report
    if (report.postedBy.id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized action. Only the report owner can mark it as found.' });
    }

    // Delete the report
    await LostPetReport.findByIdAndDelete(reportId);

    res.status(200).json({
      message: 'Lost pet report marked as found and deleted successfully.',
    });
  } catch (err) {
    console.error('Error marking lost pet report as found:', err.message);
    res.status(500).json({ message: 'Failed to mark lost pet report as found.' });
  }
});


// POST route: Match Lost and Found Pets
// Define the route to get matching pet reports
router.get('/matchPets', async (req, res) => {
  try {
    const matches = await findMatches();
    res.status(200).json({ message: 'Matches found successfully.', matches });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find matches.', details: error.message });
  }
});

router.post('/notifications', verifyToken, async (req, res) => {
  const { match } = req.body;

  try {
    const { lostPet, matchedFoundPets } = match;

    res.status(200).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});



router.post('/sendNotification', verifyToken, async (req, res) => {
  const { match } = req.body;

  try {
    const { lostPet, matchedFoundPets } = match;

    if (!lostPet || !matchedFoundPets || matchedFoundPets.length === 0) {
      return res.status(400).json({ error: 'Invalid match data.' });
    }

    // Create a notification message with the pet details
    const matchedPetNames = matchedFoundPets.map(pet => pet.petName).join(', ');
    const notificationMessage = `Your lost pet, ${lostPet.petName}, has matching found pets: ${matchedPetNames}.`;


    const newNotification = new Notification({
      message: notificationMessage,
      userId: lostPet.postedBy.id, // The user who posted the lost pet report
    });

    await newNotification.save();

    res.status(200).json({ message: 'Notification sent successfully.' });
  } catch (error) {
    console.error('Error sending notification:', error.message);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});


// GET route to fetch notifications for a user
router.get('/notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await Notification.find({ userId })
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({ message: 'Notifications fetched successfully.', notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Failed to fetch notifications.', details: error.message });
  }
});


// POST route to mark a notification as read
router.post('/notifications/markAsRead', verifyToken, async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required." });
    }

    // Update the notification status to read
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.status(200).json({ message: "Notification marked as read." });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ error: 'Failed to mark notification as read.', details: error.message });
  }
});






module.exports = router;