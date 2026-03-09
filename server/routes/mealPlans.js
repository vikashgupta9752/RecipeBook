const express = require('express');
const router = express.Router();
const MealPlan = require('../models/MealPlan');
const { protect } = require('../middleware/authMiddleware');

// Get all meal plans for authenticated user
router.get('/', protect, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = { user: req.user.id };
        
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const mealPlans = await MealPlan.find(query)
            .populate('recipe', 'title image time difficulty category')
            .sort({ date: 1, mealType: 1 });
        
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get meal plans for a specific date
router.get('/date/:date', protect, async (req, res) => {
    try {
        const date = new Date(req.params.date);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));
        
        const mealPlans = await MealPlan.find({
            user: req.user.id,
            date: { $gte: startOfDay, $lte: endOfDay }
        })
        .populate('recipe', 'title image time difficulty category')
        .sort({ mealType: 1 });
        
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create a new meal plan
router.post('/', protect, async (req, res) => {
    try {
        const { date, mealType, recipe, servings, notes } = req.body;
        
        const mealPlan = new MealPlan({
            user: req.user.id,
            date: new Date(date),
            mealType,
            recipe,
            servings: servings || 1,
            notes: notes || ''
        });
        
        await mealPlan.save();
        await mealPlan.populate('recipe', 'title image time difficulty category');
        
        res.status(201).json(mealPlan);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create meal plan', error: error.message });
    }
});

// Update a meal plan
router.put('/:id', protect, async (req, res) => {
    try {
        const { date, mealType, recipe, servings, notes } = req.body;
        
        const mealPlan = await MealPlan.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        
        if (date) mealPlan.date = new Date(date);
        if (mealType) mealPlan.mealType = mealType;
        if (recipe) mealPlan.recipe = recipe;
        if (servings) mealPlan.servings = servings;
        if (notes !== undefined) mealPlan.notes = notes;
        
        await mealPlan.save();
        await mealPlan.populate('recipe', 'title image time difficulty category');
        
        res.json(mealPlan);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update meal plan', error: error.message });
    }
});

// Delete a meal plan
router.delete('/:id', protect, async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        
        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
