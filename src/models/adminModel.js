const databaseConnectionPool = require('../config/database');

const findActiveAdminByEmail = async (email) => {
    const [adminRecords] = await databaseConnectionPool.query(
        `
        SELECT
            id,
            email,
            encrypted_password,
            created_at,
            updated_at,
            role,
            provider,
            uid,
            name,
            is_active,
            deactivated_at
        FROM lounge_users
        WHERE email = ?
          AND is_active = 1
        LIMIT 1
        `,
        [email]
    );

    return adminRecords[0] || null;
};

const findAdminById = async (userId) => {
    const [adminRecords] = await databaseConnectionPool.query(
        `
        SELECT
            id,
            email,
            name,
            role,
            provider,
            uid,
            is_active,
            deactivated_at
        FROM lounge_users
        WHERE id = ?
        LIMIT 1
        `,
        [userId]
    );

    return adminRecords[0] || null;
};

const findAdminByGoogleId = async (googleUserId) => {
    const [adminRecords] = await databaseConnectionPool.query(
        `
        SELECT
            id,
            email,
            name,
            role,
            provider,
            uid,
            is_active,
            deactivated_at
        FROM lounge_users
        WHERE provider = 'google'
          AND uid = ?
        LIMIT 1
        `,
        [googleUserId]
    );

    return adminRecords[0] || null;
};

const createGoogleAdmin = async ({
    email,
    provider,
    uid,
    name,
    role,
    is_active
}) => {
    const [insertResult] = await databaseConnectionPool.query(
        `
        INSERT INTO lounge_users (
            email,
            encrypted_password,
            provider,
            uid,
            name,
            role,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            email,
            '',
            provider,
            uid,
            name,
            role,
            is_active
        ]
    );

    return {
        id: insertResult.insertId,
        email,
        provider,
        uid,
        name,
        role,
        is_active
    };
};

const getAllUsers = async () => {
    const [users] = await databaseConnectionPool.query(
        `
        SELECT
            id,
            name,
            email,
            role,
            is_active,
            provider,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
        FROM lounge_users
        ORDER BY id ASC
        `
    );
    return users;
};

const updateUserRole = async (userId, role) => {
    const [result] = await databaseConnectionPool.query(
        'UPDATE lounge_users SET role = ? WHERE id = ?',
        [role.toLowerCase(), userId]
    );
    return result.affectedRows > 0;
};

const updateUserStatus = async (userId, isActive) => {
    const [result] = await databaseConnectionPool.query(
        'UPDATE lounge_users SET is_active = ?, deactivated_at = ? WHERE id = ?',
        [isActive ? 1 : 0, isActive ? null : new Date(), userId]
    );
    return result.affectedRows > 0;
};

module.exports = {
    findActiveAdminByEmail,
    findAdminByEmail: findActiveAdminByEmail,
    findAdminById,
    findAdminByGoogleId,
    createGoogleAdmin,
    getAllUsers,
    updateUserRole,
    updateUserStatus
};