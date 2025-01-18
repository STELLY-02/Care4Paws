const express = require('express');
const router = express.Router();
const { addPet, getPets } = require('../controllers/petController');
const petAuth = require('../middlewares/petAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// Debug middleware
router.use((req, res, next) => {
    console.log('Pet route hit:', {
        method: req.method,
        path: req.path,
        auth: req.headers.authorization ? 'Present' : 'Missing'
    });
    next();
});

// Routes
router.get('/test', (req, res) => {
    res.json({ message: 'Pet routes working' });
});

// Get all pets - accessible to all authenticated users
router.get('/', petAuth, getPets);

// Add new pet - only for coordinators
router.post('/', petAuth, (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, addPet);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Pet route error:', err);
    res.status(500).json({
        error: 'Server error',
        message: err.message
    });
});

module.exports = router;
