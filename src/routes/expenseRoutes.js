const express = require('express');

const {
    addExpense,
    listExpenses,
    updateExpenseStatus,
    deleteExpense
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

router.put(
    '/:id/status',
    authenticateUser,
    updateExpenseStatus
);

router.put(
    '/:id',
    authenticateUser,
    updateExpenseStatus
);

router.delete(
    '/:id',
    authenticateUser,
    deleteExpense
);

module.exports = router;