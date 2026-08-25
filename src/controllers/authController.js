const adminModel = require('../models/adminModel');
const roles = require('../models/roleModel');
const { generateAuthToken } = require('../utils/jwt');

const login = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is required'
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await adminModel.findActiveAdminByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const allowedRoles = [
            roles.SUPER_ADMIN,
            roles.ADMIN,
            roles.LOUNGE_USER
        ];

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Invalid user role'
            });
        }

        const authenticationToken = generateAuthToken(user);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token: authenticationToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Google authentication failed'
            });
        }

        const allowedRoles = [
            roles.SUPER_ADMIN,
            roles.ADMIN,
            roles.LOUNGE_USER
        ];

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Invalid user role'
            });
        }

        const authenticationToken = generateAuthToken(user);

        const frontendUrl = process.env.FRONTEND_URL;

        return res.redirect(
            `${frontendUrl}/auth/google/success?token=${encodeURIComponent(authenticationToken)}`
        );

    } catch (error) {
        console.error('Google callback error:', error);

        return res.status(500).json({
            success: false,
            message: 'Google login failed'
        });
    }
};

module.exports = {
    login,
    googleCallback
};