const loungeModel = require('../models/loungeModel');

const loungeController = {
    async getLounges(req, res) {
        try {
            const activeOnly = req.query.all !== 'true';
            const lounges = await loungeModel.getAllLounges(activeOnly);
            return res.status(200).json({
                success: true,
                lounges
            });
        } catch (error) {
            console.error('Error fetching lounges:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch lounges from database'
            });
        }
    },

    async getLoungeById(req, res) {
        try {
            const { id } = req.params;
            const lounge = await loungeModel.getLoungeById(id);
            if (!lounge) {
                return res.status(404).json({
                    success: false,
                    message: 'Lounge not found'
                });
            }
            return res.status(200).json({
                success: true,
                lounge
            });
        } catch (error) {
            console.error('Error fetching single lounge:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch lounge details'
            });
        }
    }
};

module.exports = loungeController;