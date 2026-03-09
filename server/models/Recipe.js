const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
    quantity: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        required: true
    }
}, { _id: false });

const stepSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    image: {
        type: String, // Optional step image
        default: ''
    },
    timeMinutes: {
        type: Number, // Optional estimated time for this step
        default: 0
    }
}, { _id: false });

const recipeSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        images: {
            type: [String],
            default: [],
        },
        image: {
            type: String, // Cover image (usually images[0])
            default: '',
        },
        servings: {
            type: Number,
            default: 1,
        },
        timeMinutes: {
            type: Number,
            required: [true, 'Please add total time in minutes'],
        },
        difficulty: {
            type: String,
            enum: ['Easy', 'Medium', 'Hard'],
            default: 'Medium',
        },
        category: {
            type: String,
            default: 'Main Course',
        },
        cuisine: {
            type: String,
            default: 'General',
        },
        tags: [String],
        dietaryTags: {
            type: [String], // e.g. ['Vegetarian', 'Vegan', 'Gluten-Free']
            default: []
        },
        ingredients: {
            type: [ingredientSchema],
            required: [true, 'Please add ingredients'],
        },
        steps: {
            type: [stepSchema],
            required: [true, 'Please add steps'],
        },
        calories: {
            type: Number, // Total estimated calories
            default: 0
        },

        // Counters for sorting/trending
        likesCount: {
            type: Number,
            default: 0,
        },
        savesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        forkCount: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        averageRating: {
            type: Number,
            default: 0,
        },
        ratingsCount: {
            type: Number,
            default: 0,
        },

        // Forking
        originalRecipeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            default: null,
        },

        // Status
        isPublic: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Add text index for search
recipeSchema.index({ title: 'text', description: 'text', tags: 'text', 'ingredients.name': 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
