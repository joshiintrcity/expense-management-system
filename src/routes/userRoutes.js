const express = require('express');

const { authenticateUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticateUser, (req, res) => {
    res.json({
        success: true,
        message: 'User API'
    });
});

module.exports = router;