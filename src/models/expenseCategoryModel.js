const db = require('../config/database');

const expenseCategoryModel = {
    async getAllCategories(activeOnly = false) {
        let query = `
            SELECT id, name, is_active, created_at, updated_at
            FROM expense_categories
        `;
        if (activeOnly) {
            query += ` WHERE is_active = 1 `;
        }
        query += ` ORDER BY name ASC `;

        const [rows] = await db.query(query);
        return rows;
    },

    async findById(id) {
        const query = `
            SELECT id, name, is_active, created_at, updated_at
            FROM expense_categories
            WHERE id = ?
            LIMIT 1
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0] || null;
    },

    async findByName(name, excludeId = null) {
        let query = `
            SELECT id, name, is_active
            FROM expense_categories
            WHERE LOWER(name) = LOWER(?)
        `;
        const params = [name.trim()];
        if (excludeId) {
            query += ` AND id != ? `;
            params.push(excludeId);
        }
        query += ` LIMIT 1 `;

        const [rows] = await db.query(query, params);
        return rows[0] || null;
    },

    async createCategory(name) {
        const query = `
            INSERT INTO expense_categories (name, is_active)
            VALUES (?, 1)
        `;
        const [result] = await db.query(query, [name.trim()]);
        return {
            id: result.insertId,
            name: name.trim(),
            is_active: 1
        };
    },

    async updateCategory(id, { name, is_active }) {
        const updates = [];
        const params = [];

        if (name !== undefined && name.trim()) {
            updates.push('name = ?');
            params.push(name.trim());
        }
        if (is_active !== undefined) {
            updates.push('is_active = ?');
            params.push(is_active ? 1 : 0);
        }

        if (updates.length === 0) return true;

        params.push(id);
        const query = `
            UPDATE expense_categories
            SET ${updates.join(', ')}
            WHERE id = ?
        `;
        await db.query(query, params);
        return true;
    },

    async deleteCategory(id) {
        const query = `
            DELETE FROM expense_categories
            WHERE id = ?
        `;
        await db.query(query, [id]);
        return true;
    }
};

module.exports = expenseCategoryModel;