const jwt = require('jsonwebtoken');
const adminModel = require('../models/adminModel');

const authenticateUser = async (req, res, next) => {
    try {
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

        const decoded = jwt.verify(
            authenticationToken,
            process.env.JWT_SECRET
        );

        // Fetch live user from database to ensure fresh role and active status
        const userId = decoded.user_id || decoded.id;
        const liveUser = (userId ? await adminModel.findAdminById(userId) : null)
                      || (decoded.email ? await adminModel.findActiveAdminByEmail(decoded.email) : null);

        if (!liveUser || !liveUser.is_active) {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive or not found'
            });
        }

        req.user = {
            user_id: liveUser.id,
            id: liveUser.id,
            email: liveUser.email,
            name: liveUser.name,
            role: liveUser.role
        };

        next();

    } catch (error) {
        console.error('Authentication error:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authenticateUser;
module.exports.authenticateUser = authenticateUser;