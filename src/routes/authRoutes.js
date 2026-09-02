const express = require('express');
const passport = require('../config/passport');
const authenticateUser = require('../middleware/authMiddleware');

const {
    login,
    getProfile,
    googleCallback
} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.get('/me', authenticateUser, getProfile);

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false
    })
);

router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/auth/google/failure'
    }),
    googleCallback
);

router.get('/google/failure', (req, res) => {
    return res.status(401).json({
        success: false,
        message: 'Google authentication failed'
    });
});

module.exports = router;