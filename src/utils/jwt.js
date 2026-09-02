const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
    return jwt.sign(
        {
            user_id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
};

module.exports = {
    generateAuthToken
};
