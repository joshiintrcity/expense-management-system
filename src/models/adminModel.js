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
            report_role_id,
            is_active,
            deactivated_at
        FROM lounge_admin
        WHERE email = ?
          AND is_active = 1
        LIMIT 1
        `,
        [email]
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
            report_role_id,
            is_active,
            deactivated_at
        FROM lounge_admin
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
        INSERT INTO lounge_admin (
            email,
            provider,
            uid,
            name,
            role,
            is_active
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
            email,
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

module.exports = {
    findActiveAdminByEmail,
    findAdminByGoogleId,
    createGoogleAdmin
};