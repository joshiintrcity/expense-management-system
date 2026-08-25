const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    try {
         console.log('Authorization Header:', req.headers.authorization);
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token is required'
            });
        }

        const authorizationParts = authorizationHeader.split(' ');

        if (
            authorizationParts.length !== 2 ||
            authorizationParts[0] !== 'Bearer'
        ) {
            return res.status(401).json({
                success: false,
                message: 'Invalid authorization format'
            });
        }

        const authenticationToken = authorizationParts[1];

        const authenticatedUser = jwt.verify(
            authenticationToken,
            process.env.JWT_SECRET
        );

        req.user = authenticatedUser;

        next();

    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// Dono import styles support karenge
module.exports = authenticateUser;
module.exports.authenticateUser = authenticateUser;