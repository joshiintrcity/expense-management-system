const express = require('express');

const {
    addExpense,
    listExpenses
} = require('../controllers/expenseController');

const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
    '/',
    authenticateUser,
    addExpense
);

router.get(
    '/',
    authenticateUser,
    listExpenses
);

module.exports = router;