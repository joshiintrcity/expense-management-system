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

const getExpenses = async (filters = {}) => {
    let query = `
        SELECT
            expenses.id,
            expenses.type,
            expenses.user_id,
            expenses.lounge_id,
            DATE_FORMAT(expenses.invoice_date, '%Y-%m-%d') AS invoice_date,
            expenses.amount,
            expenses.invoice_url,
            expenses.description,
            expenses.invoice_status,
            expenses.created_at,
            expenses.updated_at,
            lounge_users.name AS user_name,
            lounge_users.email AS user_email,
            lounges.lounge_name,
            lounges.city_name,
            lounges.city_id,
            lounges.zone AS zone_name,
            lounges.state AS state_name
        FROM expenses
        LEFT JOIN lounge_users
            ON lounge_users.id = expenses.user_id
        LEFT JOIN lounges
            ON (lounges.id = expenses.lounge_id OR lounges.lounge_id = expenses.lounge_id)
    `;

    const params = [];
    const conditions = [];

    if (filters.fromDate) {
        conditions.push('expenses.invoice_date >= ?');
        params.push(filters.fromDate);
    }
    if (filters.toDate) {
        conditions.push('expenses.invoice_date <= ?');
        params.push(filters.toDate);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY expenses.invoice_date DESC, expenses.id DESC';

    const [expenseRecords] = await databaseConnectionPool.query(query, params);
    return expenseRecords;
};

const updateExpenseStatus = async (expenseId, status) => {
    const [result] = await databaseConnectionPool.query(
        'UPDATE expenses SET invoice_status = ? WHERE id = ?',
        [status.toLowerCase(), expenseId]
    );
    return result.affectedRows > 0;
};

const deleteExpense = async (expenseId) => {
    const [result] = await databaseConnectionPool.query(
        'DELETE FROM expenses WHERE id = ?',
        [expenseId]
    );
    return result.affectedRows > 0;
};

module.exports = {
    createExpense,
    getExpenses,
    updateExpenseStatus,
    deleteExpense
};
