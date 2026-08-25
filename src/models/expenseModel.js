const databaseConnectionPool = require('../config/database');

const createExpense = async ({
    type,
    userId,
    loungeId,
    invoiceDate,
    amount,
    invoiceUrl,
    description,
    invoiceStatus
}) => {
    const [expenseInsertResult] = await databaseConnectionPool.query(
        `
        INSERT INTO expenses (
            type,
            user_id,
            lounge_id,
            invoice_date,
            amount,
            invoice_url,
            description,
            invoice_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            type,
            userId,
            loungeId,
            invoiceDate,
            amount,
            invoiceUrl || null,
            description || null,
            invoiceStatus || 'pending'
        ]
    );

    return expenseInsertResult.insertId;
};

const getExpenses = async () => {
    const [expenseRecords] = await databaseConnectionPool.query(
        `
        SELECT
            expenses.id,
            expenses.type,
            expenses.user_id,
            expenses.lounge_id,
            expenses.invoice_date,
            expenses.amount,
            expenses.invoice_url,
            expenses.description,
            expenses.invoice_status,
            expenses.created_at,
            expenses.updated_at,
            lounge_admin.name AS user_name,
            lounge_admin.email AS user_email
        FROM expenses
        LEFT JOIN lounge_admin
            ON lounge_admin.id = expenses.user_id
        ORDER BY expenses.invoice_date DESC, expenses.id DESC
        `
    );

    return expenseRecords;
};

module.exports = {
    createExpense,
    getExpenses
};
