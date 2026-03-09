const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Recipe = require('../models/Recipe');
const { protect } = require('../middleware/authMiddleware');
const { createActivity } = require('./activity');

// Create group
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, isPrivate, coverImage } = req.body;

        const group = new Group({
            name,
            description,
            owner: req.user.id,
            members: [req.user.id],
            isPrivate: isPrivate || false,
            coverImage: coverImage || ''
        });

        await group.save();
        await group.populate('owner members', 'username email');

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user's groups
router.get('/', protect, async (req, res) => {
    try {
        const groups = await Group.find({
            members: req.user.id
        }).populate('owner members', 'username email').sort({ createdAt: -1 });

        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get group by ID
router.get('/:id', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id)
            .populate('owner members', 'username email')
            .populate('invitations.user', 'username email');

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is member or if group is public
        const isMember = group.members.some(member => member._id.toString() === req.user.id);
        if (!isMember && group.isPrivate) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update group
router.put('/:id', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only group owner can update' });
        }

        const { name, description, isPrivate, coverImage } = req.body;

        if (name) group.name = name;
        if (description !== undefined) group.description = description;
        if (isPrivate !== undefined) group.isPrivate = isPrivate;
        if (coverImage !== undefined) group.coverImage = coverImage;

        await group.save();
        await group.populate('owner members', 'username email');

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete group
router.delete('/:id', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Only group owner can delete' });
        }

        await group.deleteOne();
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Invite users to group
router.post('/:id/invite', protect, async (req, res) => {
    try {
        const { userIds } = req.body; // Array of user IDs
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if requester is owner or member
        const isMember = group.members.some(m => m.toString() === req.user.id);
        if (!isMember) {
            return res.status(403).json({ message: 'Only members can invite' });
        }

        // Add invitations
        for (const userId of userIds) {
            // Check if already member
            if (group.members.includes(userId)) continue;
            
            // Check if already invited
            const alreadyInvited = group.invitations.some(inv => inv.user.toString() === userId);
            if (alreadyInvited) continue;

            group.invitations.push({
                user: userId,
                status: 'pending'
            });

            // Create activity notification
            await createActivity(userId, 'group_invite', req.user.id, group._id, `invited you to join group "${group.name}"`, 'Group');
        }

        await group.save();
        await group.populate('invitations.user', 'username email');

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Accept group invitation
router.put('/:id/join', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const invitation = group.invitations.find(
            inv => inv.user.toString() === req.user.id && inv.status === 'pending'
        );

        if (!invitation) {
            return res.status(404).json({ message: 'No pending invitation found' });
        }

        // Update invitation status
        invitation.status = 'accepted';
        
        // Add to members
        if (!group.members.includes(req.user.id)) {
            group.members.push(req.user.id);
        }

        await group.save();
        await group.populate('owner members', 'username email');

        // Create activity notification
        await createActivity(group.owner, 'group_join', req.user.id, group._id, `joined your group "${group.name}"`, 'Group');

        res.json(group);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Leave group
router.delete('/:id/leave', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.owner.toString() === req.user.id) {
            return res.status(400).json({ message: 'Owner cannot leave group. Transfer ownership or delete group.' });
        }

        group.members = group.members.filter(m => m.toString() !== req.user.id);
        await group.save();

        res.json({ message: 'Left group successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get group recipes
router.get('/:id/recipes', protect, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check access
        const isMember = group.members.some(m => m.toString() === req.user.id);
        if (!isMember && group.isPrivate) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const recipes = await Recipe.find({ group: req.params.id })
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get pending invitations for user
router.get('/invitations/pending', protect, async (req, res) => {
    try {
        const groups = await Group.find({
            'invitations': {
                $elemMatch: {
                    user: req.user.id,
                    status: 'pending'
                }
            }
        }).populate('owner', 'username email');

        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
