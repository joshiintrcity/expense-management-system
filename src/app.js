const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const passport = require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const expenseCategoryRoutes = require('./routes/expenseCategoryRoutes');
const loungeRoutes = require('./routes/loungeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded receipts statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(passport.initialize());

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Expense Management API is running successfully'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/expense-categories', expenseCategoryRoutes);
app.use('/api/lounges', loungeRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});