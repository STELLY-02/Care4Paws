const express = require('express');
const router = express.Router();
const { addPet, getPets } = require('../controllers/petController');
const petAuth = require('../middlewares/petAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create absolute path for uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
console.log('Upload directory path:', uploadDir);

// Create directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    try {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('Created uploads directory at:', uploadDir);
    } catch (error) {
        console.error('Error creating uploads directory:', error);
    }
}

// Verify directory is writable
try {
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log('Uploads directory is writable');
} catch (error) {
    console.error('Uploads directory is not writable:', error);
}

// Configure multer with error handling
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('Multer destination called');
        console.log('File:', file);
        console.log('Upload dir:', uploadDir);
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        console.log('Multer filename called');
        console.log('Original filename:', file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'pet-' + uniqueSuffix + path.extname(file.originalname);
        console.log('Generated filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        console.log('File filter called for:', file.originalname);
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
}).single('photo');

// Serve static files from uploads directory
router.use('/uploads', express.static(uploadDir));

// Debug middleware
router.use((req, res, next) => {
    console.log('Request details:', {
        method: req.method,
        path: req.path,
        contentType: req.headers['content-type'],
        body: req.body,
        file: req.file
    });
    next();
});

// POST route with better error handling
router.post('/', petAuth, (req, res, next) => {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            console.error('Other upload error:', err);
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ error: 'Please upload a photo' });
        }

        console.log('File uploaded successfully:', {
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype
        });

        next();
    });
}, addPet);

router.get('/', petAuth, getPets);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Route error:', err);
    res.status(500).json({ error: err.message });
});

module.exports = router;
