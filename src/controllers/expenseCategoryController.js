const expenseCategoryModel = require('../models/expenseCategoryModel');

const expenseCategoryController = {
    async getCategories(req, res) {
        try {
            const activeOnly = req.query.active_only === 'true';
            const categories = await expenseCategoryModel.getAllCategories(activeOnly);
            return res.status(200).json({
                success: true,
                categories
            });
        } catch (error) {
            console.error('Error fetching expense categories:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch expense categories'
            });
        }
    },

    async createCategory(req, res) {
        try {
            const { name } = req.body;

            if (!name || typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Category name is required'
                });
            }

            const existing = await expenseCategoryModel.findByName(name.trim());
            if (existing) {
                return res.status(409).json({
                    success: false,
                    message: 'An expense category with this name already exists'
                });
            }

            const created = await expenseCategoryModel.createCategory(name.trim());

            return res.status(201).json({
                success: true,
                message: 'Expense category created successfully in database',
                category: created
            });
        } catch (error) {
            console.error('Error creating expense category:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'An expense category with this name already exists'
                });
            }
            return res.status(500).json({
                success: false,
                message: 'Failed to create expense category in database'
            });
        }
    },

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name, is_active } = req.body;

            const existing = await expenseCategoryModel.findById(id);
            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: 'Category not found'
                });
            }

            if (name && name.trim()) {
                const duplicate = await expenseCategoryModel.findByName(name.trim(), id);
                if (duplicate) {
                    return res.status(409).json({
                        success: false,
                        message: 'Another category with this name already exists'
                    });
                }
            }

            await expenseCategoryModel.updateCategory(id, { name, is_active });

            return res.status(200).json({
                success: true,
                message: 'Expense category updated successfully'
            });
        } catch (error) {
            console.error('Error updating category:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update expense category'
            });
        }
    },

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            await expenseCategoryModel.deleteCategory(id);
            return res.status(200).json({
                success: true,
                message: 'Expense category removed successfully from database'
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete expense category'
            });
        }
    }
};

module.exports = expenseCategoryController;