const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Thought = require('../models/Thought');
const { protect } = require('../middleware/authMiddleware');

// Admin middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

// Get dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRecipes = await Recipe.countDocuments();
        const totalThoughts = await Thought.countDocuments();
        
        // Calculate total views/likes if possible, or just return counts
        const recipes = await Recipe.find().select('views likesCount');
        const totalViews = recipes.reduce((acc, r) => acc + (r.views || 0), 0);
        const totalLikes = recipes.reduce((acc, r) => acc + (r.likesCount || 0), 0);

        res.json({
            totalUsers,
            totalRecipes,
            totalThoughts,
            totalViews,
            totalLikes
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user (suspend/promote)
router.put('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.isSuspended !== undefined) user.isSuspended = req.body.isSuspended;
        if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        await Recipe.deleteMany({ user: req.params.id });
        res.json({ message: 'User and their recipes deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all recipes
router.get('/recipes', protect, adminOnly, async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('user', 'username email')
            .sort({ createdAt: -1 });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete recipe
router.delete('/recipes/:id', protect, adminOnly, async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
