const expenseModel = require('../models/expenseModel');

const addExpense = async (req, res) => {
    try {
        const {
            type,
            lounge_id,
            loungeId,
            invoice_date,
            invoiceDate,
            date,
            amount,
            invoice_url,
            invoiceUrl,
            description,
            title,
            remarks,
            invoice_status,
            invoiceStatus
        } = req.body;

        const finalType = type || req.body.expenseHeadName || 'General';
        
        let finalLoungeId = lounge_id !== undefined ? lounge_id : loungeId;
        if (typeof finalLoungeId === 'string') {
            const digits = finalLoungeId.replace(/\D/g, '');
            finalLoungeId = digits ? parseInt(digits, 10) : 10;
        } else if (typeof finalLoungeId !== 'number') {
            finalLoungeId = 10;
        }

        const finalInvoiceDate = invoice_date || invoiceDate || date;
        const finalAmount = Number(amount);
        const finalInvoiceUrl = invoice_url || invoiceUrl || null;
        const finalDescription = description || (title ? (remarks ? `${title} - ${remarks}` : title) : remarks) || null;
        const finalInvoiceStatus = invoice_status || invoiceStatus || 'pending';

        if (!finalType || !finalInvoiceDate || isNaN(finalAmount) || finalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'type, invoice_date and a valid amount greater than 0 are required'
            });
        }

        // user_id from JWT payload
        const userId = req.user?.user_id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const expenseId = await expenseModel.createExpense({
            type: finalType,
            userId,
            loungeId: finalLoungeId,
            invoiceDate: finalInvoiceDate,
            amount: finalAmount,
            invoiceUrl: finalInvoiceUrl,
            description: finalDescription,
            invoiceStatus: finalInvoiceStatus
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
        const { from_date, to_date, fromDate, toDate } = req.query;
        const finalFromDate = from_date || fromDate || null;
        const finalToDate = to_date || toDate || null;

        const expenseRecords = await expenseModel.getExpenses({
            fromDate: finalFromDate,
            toDate: finalToDate
        });

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

const updateExpenseStatus = async (req, res) => {
    try {
        const userRole = String(req.user?.role || '').toLowerCase().replace(/_/g, '');
        
        // Only super_admin (SUPER_ADMIN) can edit/approve expense status
        if (userRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only Super Admin is authorized to edit expense status'
            });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: 'Expense ID and status are required'
            });
        }

        const validStatuses = ['approved', 'pending', 'rejected'];
        if (!validStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Status must be approved, pending, or rejected.'
            });
        }

        const updated = await expenseModel.updateExpenseStatus(id, status);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: `Expense status updated to ${status}`,
            status
        });

    } catch (error) {
        console.error('Update status error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const userRole = String(req.user?.role || '').toLowerCase().replace(/_/g, '');
        
        // Only super_admin (SUPER_ADMIN) can delete expenses
        if (userRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only Super Admin is authorized to delete expenses'
            });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Expense ID is required'
            });
        }

        const deleted = await expenseModel.deleteExpense(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found or already deleted'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });

    } catch (error) {
        console.error('Delete expense error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    addExpense,
    listExpenses,
    updateExpenseStatus,
    deleteExpense
};