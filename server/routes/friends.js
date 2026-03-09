const express = require('express');
const router = express.Router();
const Friendship = require('../models/Friendship');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { createActivity } = require('./activity');

// Send friend request
router.post('/request/:userId', protect, async (req, res) => {
    try {
        const requesterId = req.user.id;
        const recipientId = req.params.userId;

        if (requesterId === recipientId) {
            return res.status(400).json({ message: 'Cannot send friend request to yourself' });
        }

        // Check if friendship already exists
        const existing = await Friendship.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ]
        });

        if (existing) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const friendship = new Friendship({
            requester: requesterId,
            recipient: recipientId,
        });

        await friendship.save();
        await friendship.populate('requester recipient', 'username email');

        // Create activity notification
        await createActivity(recipientId, 'friend_request', requesterId, null, 'sent you a friend request');

        res.status(201).json(friendship);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Accept friend request
router.put('/accept/:id', protect, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.id);

        if (!friendship) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (friendship.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        friendship.status = 'accepted';
        await friendship.save();
        await friendship.populate('requester recipient', 'username email');

        // Create activity notification
        await createActivity(friendship.requester._id, 'friend_accept', req.user.id, null, 'accepted your friend request');

        res.json(friendship);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Decline friend request
router.put('/decline/:id', protect, async (req, res) => {
    try {
        const friendship = await Friendship.findById(req.params.id);

        if (!friendship) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (friendship.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        friendship.status = 'declined';
        await friendship.save();

        res.json({ message: 'Friend request declined' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Remove friend
router.delete('/remove/:userId', protect, async (req, res) => {
    try {
        const userId = req.user.id;
        const friendId = req.params.userId;

        const friendship = await Friendship.findOneAndDelete({
            $or: [
                { requester: userId, recipient: friendId },
                { requester: friendId, recipient: userId }
            ]
        });

        if (!friendship) {
            return res.status(404).json({ message: 'Friendship not found' });
        }

        res.json({ message: 'Friend removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all friends
router.get('/', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        const friendships = await Friendship.find({
            $or: [
                { requester: userId, status: 'accepted' },
                { recipient: userId, status: 'accepted' }
            ]
        }).populate('requester recipient', 'username email');

        // Extract friend details
        const friends = friendships.map(friendship => {
            const friend = friendship.requester._id.toString() === userId 
                ? friendship.recipient 
                : friendship.requester;
            return {
                ...friend.toObject(),
                friendshipId: friendship._id,
                since: friendship.createdAt
            };
        });

        res.json(friends);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get pending friend requests (received)
router.get('/requests', protect, async (req, res) => {
    try {
        const requests = await Friendship.find({
            recipient: req.user.id,
            status: 'pending'
        }).populate('requester', 'username email').sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get sent requests
router.get('/sent', protect, async (req, res) => {
    try {
        const requests = await Friendship.find({
            requester: req.user.id,
            status: 'pending'
        }).populate('recipient', 'username email').sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get friend suggestions (users not yet friends)
router.get('/suggestions', protect, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all friendships for this user
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }]
        });

        // Extract IDs of connected users
        const connectedUserIds = friendships.map(f => 
            f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString()
        );
        connectedUserIds.push(userId); // Exclude self

        // Find users not in connected list
        const suggestions = await User.find({
            _id: { $nin: connectedUserIds },
            isBlocked: { $ne: true }
        }).select('username email').limit(10);

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Search users
router.get('/search', protect, async (req, res) => {
    try {
        const { q } = req.query;
        const userId = req.user.id;

        if (!q || q.trim().length < 2) {
            return res.json([]);
        }

        // Get all friendships for this user
        const friendships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }]
        });

        // Extract IDs of connected users
        const connectedUserIds = friendships.map(f => 
            f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString()
        );
        connectedUserIds.push(userId); // Exclude self

        // Search for users by username or email
        const searchResults = await User.find({
            _id: { $nin: connectedUserIds },
            isBlocked: { $ne: true },
            $or: [
                { username: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } }
            ]
        }).select('username email').limit(20);

        res.json(searchResults);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
