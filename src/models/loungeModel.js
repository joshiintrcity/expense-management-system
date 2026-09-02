const db = require('../config/database');

const loungeModel = {
    async getAllLounges(activeOnly = true) {
        let query = `
            SELECT 
                id, 
                lounge_id, 
                lounge_name, 
                address, 
                lounge_type, 
                city_id, 
                city_name, 
                lat, 
                lon, 
                zone, 
                state, 
                is_active, 
                created_at, 
                updated_at
            FROM lounges
        `;
        if (activeOnly) {
            query += ` WHERE is_active = 1 `;
        }
        query += ` ORDER BY lounge_name ASC `;

        const [rows] = await db.query(query);
        return rows;
    },

    async getLoungeById(id) {
        const query = `
            SELECT *
            FROM lounges
            WHERE id = ? OR lounge_id = ?
            LIMIT 1
        `;
        const [rows] = await db.query(query, [id, id]);
        return rows[0] || null;
    }
};

module.exports = loungeModel;