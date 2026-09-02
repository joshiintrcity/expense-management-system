const express = require('express');
const router = express.Router();
const expenseCategoryController = require('../controllers/expenseCategoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Get categories list
router.get('/', expenseCategoryController.getCategories);

// Create category
router.post('/', authMiddleware, expenseCategoryController.createCategory);

// Update category (name and/or is_active)
router.put('/:id', authMiddleware, expenseCategoryController.updateCategory);

// Delete category
router.delete('/:id', authMiddleware, expenseCategoryController.deleteCategory);

module.exports = router;