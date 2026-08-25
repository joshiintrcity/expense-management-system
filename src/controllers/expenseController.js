const expenseModel = require('../models/expenseModel');

const addExpense = async (req, res) => {
    try {
        const {
            type,
            lounge_id,
            invoice_date,
            amount,
            invoice_url,
            description,
            invoice_status
        } = req.body;

        if (!type || !lounge_id || !invoice_date || amount === undefined) {
            return res.status(400).json({
                success: false,
                message: 'type, lounge_id, invoice_date and amount are required'
            });
        }

        // user_id JWT se liya jayega
        const userId = req.user.user_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const expenseId = await expenseModel.createExpense({
            type,
            userId,
            loungeId: lounge_id,
            invoiceDate: invoice_date,
            amount,
            invoiceUrl: invoice_url,
            description,
            invoiceStatus: invoice_status
        });

        return res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            expense_id: expenseId
        });

    } catch (error) {
        console.error('Add expense error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const listExpenses = async (req, res) => {
    try {
        const expenseRecords = await expenseModel.getExpenses();

        return res.status(200).json({
            success: true,
            message: 'Expenses fetched successfully',
            expenses: expenseRecords
        });

    } catch (error) {
        console.error('List expenses error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    addExpense,
    listExpenses
};
