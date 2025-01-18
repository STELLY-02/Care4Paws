const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/AdoptFormMiddleware');
const { validateAdoptForm } = require('../middlewares/AdoptFormMiddleware');
const { submitAdoptForm } = require('../controllers/AdoptFormController');

// Debug to check if all middlewares are defined
console.log('Middlewares loaded:', {
    auth: !!auth,
    validateAdoptForm: !!validateAdoptForm,
    submitAdoptForm: !!submitAdoptForm
});

// Debug logging
router.use((req, res, next) => {
    console.log('Adopt form route hit:', {
        method: req.method,
        path: req.path,
        params: req.params,
        body: req.body
    });
    next();
});

// Make sure all middleware functions exist before using them
if (!auth || !validateAdoptForm || !submitAdoptForm) {
    console.error('Missing middleware functions:', {
        auth: !auth,
        validateAdoptForm: !validateAdoptForm,
        submitAdoptForm: !submitAdoptForm
    });
    throw new Error('Required middleware functions are not properly loaded');
}

// Submit adoption form route
router.post('/:petId/submit', auth, validateAdoptForm, submitAdoptForm);

module.exports = router;
