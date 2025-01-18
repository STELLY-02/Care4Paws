const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/AdoptFormMiddleware');
const { validateAdoptForm } = require('../middlewares/AdoptFormMiddleware');
const { submitAdoptForm, getAdoptionForms, updateAdoptionStatus } = require('../controllers/AdoptFormController');

// Debug logging
router.use((req, res, next) => {
    console.log('Adopt form route hit:', {
        method: req.method,
        path: req.path,
        params: req.params
    });
    next();
});

// Get all adoption forms for a coordinator
router.get('/', auth, getAdoptionForms);

// Submit adoption form route
router.post('/:petId/submit', auth, validateAdoptForm, submitAdoptForm);

// Add status update route
router.patch('/:requestId/status', auth, updateAdoptionStatus);

module.exports = router;
