const adminModel = require('../models/adminModel');
const roles = require('../models/roleModel');

const listUsers = async (req, res) => {
    try {
        const currentUserRole = String(req.user?.role || '').toLowerCase().replace(/_/g, '');
        let users = await adminModel.getAllUsers();

        // If requesting user is NOT super_admin (i.e. an Admin or Lounge User),
        // hide super_admin and admin accounts so they can only see lounge_user records
        if (currentUserRole !== 'superadmin') {
            users = users.filter(u => {
                const r = String(u.role || '').toLowerCase().replace(/_/g, '');
                return r === 'loungeuser' || r === 'loungestaff' || (!r.includes('super') && !r.includes('admin'));
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully',
            users
        });
    } catch (error) {
        console.error('List users error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const currentUserRole = String(req.user?.role || '').toLowerCase().replace(/_/g, '');
        if (currentUserRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only Super Admin can change user roles'
            });
        }

        const { id } = req.params;
        const { role } = req.body;

        if (!id || !role) {
            return res.status(400).json({
                success: false,
                message: 'User ID and role are required'
            });
        }

        const allowedRoles = [
            roles.SUPER_ADMIN,
            roles.ADMIN,
            roles.LOUNGE_USER
        ];

        if (!allowedRoles.includes(role.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        const updated = await adminModel.updateUserRole(id, role);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: `User role updated to ${role}`
        });
    } catch (error) {
        console.error('Update user role error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const currentUserRole = String(req.user?.role || '').toLowerCase().replace(/_/g, '');
        if (currentUserRole !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied: Only Super Admin can change user status'
            });
        }

        const { id } = req.params;
        const { is_active, isActive } = req.body;

        const finalStatus = is_active !== undefined ? is_active : isActive;

        if (id === undefined || finalStatus === undefined) {
            return res.status(400).json({
                success: false,
                message: 'User ID and status are required'
            });
        }

        const updated = await adminModel.updateUserStatus(id, !!finalStatus);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: `User status updated to ${finalStatus ? 'Active' : 'Inactive'}`
        });
    } catch (error) {
        console.error('Update user status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    listUsers,
    updateUserRole,
    updateUserStatus
};