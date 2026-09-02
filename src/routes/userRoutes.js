const express = require('express');
const { authenticateUser } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/', authenticateUser, userController.listUsers);
router.put('/:id/role', authenticateUser, userController.updateUserRole);
router.put('/:id/status', authenticateUser, userController.updateUserStatus);

module.exports = router;