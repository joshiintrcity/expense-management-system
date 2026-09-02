const express = require('express');
const router = express.Router();
const loungeController = require('../controllers/loungeController');

// GET /api/lounges (List all active lounges)
router.get('/', loungeController.getLounges);

// GET /api/lounges/:id (Single lounge details)
router.get('/:id', loungeController.getLoungeById);

module.exports = router;