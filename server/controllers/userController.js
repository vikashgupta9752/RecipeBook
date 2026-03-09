const User = require('../models/User');
const Recipe = require('../models/Recipe');

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public (some info private)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const recipes = await Recipe.find({ user: req.params.id, isPublic: true }).sort({ createdAt: -1 });
        
        // Check if logged in user is following
        let isFollowing = false;
        if (req.user) {
            isFollowing = user.followers.includes(req.user.id);
        }

        res.json({
            ...user.toObject(),
            recipes,
            isFollowing,
            followersCount: user.followers.length,
            followingCount: user.following.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Follow a user
// @route   POST /api/users/follow/:id
// @access  Private
const followUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToFollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!userToFollow.followers.includes(req.user.id)) {
            await userToFollow.updateOne({ $push: { followers: req.user.id } });
            await currentUser.updateOne({ $push: { following: req.params.id } });
            res.status(200).json({ message: 'User followed' });
        } else {
            res.status(400).json({ message: 'You already follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unfollow a user
// @route   PUT /api/users/unfollow/:id
// @access  Private
const unfollowUser = async (req, res) => {
    if (req.user.id === req.params.id) {
        return res.status(400).json({ message: 'Cannot unfollow yourself' });
    }

    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!userToUnfollow || !currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (userToUnfollow.followers.includes(req.user.id)) {
            await userToUnfollow.updateOne({ $pull: { followers: req.user.id } });
            await currentUser.updateOne({ $pull: { following: req.params.id } });
            res.status(200).json({ message: 'User unfollowed' });
        } else {
            res.status(400).json({ message: 'You do not follow this user' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get suggested users
// @route   GET /api/users/suggestions
// @access  Private
const getSuggestedUsers = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        
        // Find users not followed by current user and not self
        const suggestions = await User.find({
            _id: { $nin: [...currentUser.following, req.user.id] },
            isSuspended: { $ne: true } // Exclude suspended users
        })
        .select('username avatarUrl bio followers')
        .sort({ followers: -1 }) // Sort by popularity
        .limit(10);

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
const searchUsers = async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    try {
        const users = await User.find({
            username: { $regex: q, $options: 'i' },
            isSuspended: { $ne: true }
        }).select('username avatarUrl bio followers');
        
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user followers
// @route   GET /api/users/followers/:id
// @access  Public
const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('followers', 'username avatarUrl bio');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user following
// @route   GET /api/users/following/:id
// @access  Public
const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('following', 'username avatarUrl bio');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    followUser,
    unfollowUser,
    getSuggestedUsers,
    searchUsers,
    getFollowers,
    getFollowing
};
