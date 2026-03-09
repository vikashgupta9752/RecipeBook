const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    servings: {
        type: Number,
        default: 1
    },
    notes: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// Index for efficient queries
mealPlanSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('MealPlan', mealPlanSchema);
