const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/authMiddleware');

// Get user's activity feed
router.get('/feed', protect, async (req, res) => {
    try {
        const activities = await Activity.find({ user: req.user.id })
            .populate('actor', 'username email')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get notifications (unread activities)
router.get('/notifications', protect, async (req, res) => {
    try {
        const notifications = await Activity.find({ 
            user: req.user.id,
            isRead: false 
        })
            .populate('actor', 'username email')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark activity as read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }

        activity.isRead = true;
        await activity.save();

        res.json(activity);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Mark all as read
router.put('/read-all', protect, async (req, res) => {
    try {
        await Activity.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Helper function to create activity (exported for use in other routes)
const createActivity = async (userId, type, actorId, targetId, message, targetModel = null) => {
    try {
        if (!userId || !actorId) {
            console.warn('Skipping activity creation: Missing userId or actorId');
            return;
        }

        const activity = new Activity({
            user: userId,
            type,
            actor: actorId,
            targetId,
            targetModel,
            message
        });
        await activity.save();
        return activity;
    } catch (error) {
        console.error('Error creating activity:', error);
    }
};

module.exports = router;
module.exports.createActivity = createActivity;
