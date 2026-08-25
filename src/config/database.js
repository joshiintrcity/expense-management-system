const mysql = require('mysql2/promise');
require('dotenv').config();

const currentEnvironment = process.env.NODE_ENV || 'local';

const databaseConfigurations = {
    local: {
        host: process.env.LOCAL_DB_HOST,
        user: process.env.LOCAL_DB_USER,
        password: process.env.LOCAL_DB_PASSWORD,
        database: process.env.LOCAL_DB_NAME
    },

    stage: {
        host: process.env.STAGE_DB_HOST,
        user: process.env.STAGE_DB_USER,
        password: process.env.STAGE_DB_PASSWORD,
        database: process.env.STAGE_DB_NAME
    },

    production: {
        host: process.env.PRODUCTION_DB_HOST,
        user: process.env.PRODUCTION_DB_USER,
        password: process.env.PRODUCTION_DB_PASSWORD,
        database: process.env.PRODUCTION_DB_NAME
    }
};

const selectedDatabaseConfiguration =
    databaseConfigurations[currentEnvironment];

if (!selectedDatabaseConfiguration) {
    throw new Error(
        `Invalid NODE_ENV: ${currentEnvironment}. Use local, stage, or production.`
    );
}

const databaseConnectionPool = mysql.createPool({
    host: process.env.LOCAL_DB_HOST,
    user: process.env.LOCAL_DB_USER,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

module.exports = databaseConnectionPool;