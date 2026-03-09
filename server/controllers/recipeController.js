const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Save = require('../models/Save');
const View = require('../models/View');
const Notification = require('../models/Notification');
const Rating = require('../models/Rating');

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
    try {
        const { search, category, dietary, sort } = req.query;

        let query = {
            $or: [
                { isPublic: true },                       // public recipes
                req.user ? { user: req.user.id } : null  // own recipes
            ].filter(Boolean),
        };

        if (search) {
            query.$text = { $search: search };
        }

        if (category && category !== 'All') {
            query.category = category;
        }

        if (dietary) {
            query.dietaryTags = { $in: [dietary] };
        }

        let recipes = await Recipe.find(query)
            .populate('user', 'username avatarUrl')
            .populate('originalRecipeId', 'title user')
            .sort({ createdAt: -1 });

        res.status(200).json(recipes);
    } catch (error) {
        console.error('GET RECIPES ERROR:', error);
        res.status(500).json({ message: error.message });
    }
};


// @desc    Get trending recipes (Algorithmic)
// @route   GET /api/recipes/trending
// @access  Public
const getTrendingRecipes = async (req, res) => {
    try {
        // Fetch recent recipes (last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recipes = await Recipe.find({
            createdAt: { $gte: thirtyDaysAgo },
            isPublic: true,
        }).populate('user', 'username avatarUrl');

        // Calculate score
        // score = views*0.1 + likes*0.3 + saves*0.2 + forks*0.2 + comments*0.1 - age_penalty
        const scoredRecipes = recipes.map(recipe => {
            const hoursAge = (Date.now() - recipe.createdAt) / (1000 * 60 * 60);
            const agePenalty = Math.pow(hoursAge + 2, 1.5); // Decay factor

            const score = (
                (recipe.views || 0) * 0.1 +
                (recipe.likesCount || 0) * 3 + // Higher weight for likes
                (recipe.savesCount || 0) * 2 +
                (recipe.forkCount || 0) * 4 + // High weight for forks
                (recipe.commentsCount || 0) * 1
            ) / agePenalty;

            return { ...recipe.toObject(), score };
        });

        // Sort by score
        scoredRecipes.sort((a, b) => b.score - a.score);

        res.status(200).json(scoredRecipes.slice(0, 20));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('user', 'username avatarUrl bio')
            .populate('originalRecipeId', 'title user');

        if (!recipe) {
            res.status(404);
            throw new Error('Recipe not found');
        }

        // Increment view count (Unique views logic)
        const isOwner = req.user && (req.user.id === recipe.user._id.toString() || req.user.isAdmin);
        const shouldIncrement = req.query.skipView !== 'true' && !isOwner;

        if (shouldIncrement) {
            try {
                const ip = req.ip || req.connection.remoteAddress;
                const userId = req.user ? req.user.id : null;

                // Check for existing view in the last 24 hours
                const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

                const query = {
                    recipe: recipe._id,
                    createdAt: { $gte: twentyFourHoursAgo }
                };

                if (userId) {
                    query.user = userId;
                } else {
                    query.ip = ip;
                }

                const existingView = await View.findOne(query);

                if (!existingView) {
                    // Record new view
                    await View.create({
                        user: userId,
                        recipe: recipe._id,
                        ip: ip
                    });

                    recipe.views = (recipe.views || 0) + 1;
                    await recipe.save({ validateBeforeSave: false });
                }
            } catch (err) {
                console.error('Error incrementing view count:', err);
            }
        }

        // Fetch additional data
        const comments = await Comment.find({ recipe: recipe._id })
            .populate('user', 'username avatarUrl')
            .sort({ createdAt: -1 });

        const ratings = await Rating.find({ recipe: recipe._id });

        // Calculate distribution
        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(r => {
            if (ratingDistribution[r.score] !== undefined) {
                ratingDistribution[r.score]++;
            }
        });

        // User specific data
        let isLiked = false;
        let isSaved = false;
        let userRating = 0;

        if (req.user) {
            const like = await Like.findOne({ user: req.user.id, recipe: recipe._id });
            isLiked = !!like;

            const save = await Save.findOne({ user: req.user.id, recipe: recipe._id });
            isSaved = !!save;

            const myRating = ratings.find(r => r.user.toString() === req.user.id);
            if (myRating) userRating = myRating.score;
        }

        res.status(200).json({
            ...recipe.toObject(),
            isLiked,
            isSaved,
            userRating,
            ratingDistribution,
            comments
        });
    } catch (error) {
        console.error('Get Recipe Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
    try {
        const {
            title, description, ingredients, steps, timeMinutes, difficulty,
            calories, images, category, tags, dietaryTags, servings, isPublic
        } = req.body;

        if (!title || !ingredients || !steps) {
            res.status(400);
            throw new Error('Please add all required fields');
        }

        // Handle image: first one is cover
        const coverImage = (images && images.length > 0) ? images[0] : '';

        const recipe = await Recipe.create({
            user: req.user.id,
            title,
            description,
            ingredients, // Expecting array of objects
            steps, // Expecting array of objects
            timeMinutes: Number(timeMinutes) || 0,
            difficulty,
            calories: Number(calories) || 0,
            images: images || [],
            image: coverImage,
            category,
            tags,
            dietaryTags,
            servings: Number(servings) || 1,
            isPublic: isPublic !== undefined ? isPublic : true,
        });

        res.status(201).json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            res.status(404);
            throw new Error('Recipe not found');
        }

        if (recipe.user.toString() !== req.user.id && !req.user.isAdmin) {
            res.status(401);
            throw new Error('User not authorized');
        }

        // Update fields
        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            res.status(404);
            throw new Error('Recipe not found');
        }

        if (recipe.user.toString() !== req.user.id && !req.user.isAdmin) {
            res.status(401);
            throw new Error('User not authorized');
        }

        await recipe.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Like/Unlike a recipe
// @route   POST /api/recipes/:id/like
// @access  Private
const likeRecipe = async (req, res) => {
    try {
        console.log(`Attempting to like recipe ${req.params.id} by user ${req.user?.id}`);
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const existingLike = await Like.findOne({ user: req.user.id, recipe: recipe._id });

        if (existingLike) {
            console.log('Removing existing like');
            await existingLike.deleteOne();
            recipe.likesCount = Math.max(0, (recipe.likesCount || 0) - 1);
        } else {
            console.log('Creating new like');
            await Like.create({ user: req.user.id, recipe: recipe._id });
            recipe.likesCount = (recipe.likesCount || 0) + 1;

            // Create Notification if not self-like
            const recipeUserId = recipe.user.toString();
            const currentUserId = req.user.id;

            const fs = require('fs');
            const logMsg = `[${new Date().toISOString()}] Like: RecipeUser=${recipeUserId}, CurrentUser=${currentUserId}\n`;
            try { fs.appendFileSync('debug.log', logMsg); } catch (e) { }

            // Force creation for debugging
            if (true) {
                console.log(`Creating notification for user ${recipeUserId} from ${currentUserId}`);
                try {
                    const notification = await Notification.create({
                        recipient: recipe.user,
                        sender: req.user.id,
                        type: 'like',
                        recipe: recipe._id
                    });
                    try { fs.appendFileSync('debug.log', `Notification created: ${notification._id}\n`); } catch (e) { }
                } catch (notifError) {
                    try { fs.appendFileSync('debug.log', `Error creating notification: ${notifError.message}\n`); } catch (e) { }
                }
            }
        }

        console.log('Saving recipe with new likesCount:', recipe.likesCount);
        await recipe.save({ validateBeforeSave: false });
        res.status(200).json({ likesCount: recipe.likesCount, isLiked: !existingLike });
    } catch (error) {
        console.error('Error in likeRecipe:', error);
        res.status(500).json({ message: error.message, stack: error.stack });
    }
};

// @desc    Save/Unsave a recipe
// @route   POST /api/recipes/:id/save
// @access  Private
const saveRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const existingSave = await Save.findOne({ user: req.user.id, recipe: recipe._id });

        if (existingSave) {
            await existingSave.deleteOne();
            recipe.savesCount = Math.max(0, recipe.savesCount - 1);
        } else {
            await Save.create({ user: req.user.id, recipe: recipe._id });
            recipe.savesCount += 1;
        }

        await recipe.save({ validateBeforeSave: false });
        res.status(200).json({ savesCount: recipe.savesCount, isSaved: !existingSave });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fork a recipe
// @route   POST /api/recipes/:id/fork
// @access  Private
const forkRecipe = async (req, res) => {
    try {
        const originalRecipe = await Recipe.findById(req.params.id);
        if (!originalRecipe) return res.status(404).json({ message: 'Recipe not found' });

        // Create new recipe based on original
        const newRecipe = await Recipe.create({
            user: req.user.id,
            title: `My take on ${originalRecipe.title}`,
            description: originalRecipe.description,
            ingredients: originalRecipe.ingredients,
            steps: originalRecipe.steps,
            timeMinutes: originalRecipe.timeMinutes,
            difficulty: originalRecipe.difficulty,
            calories: originalRecipe.calories,
            images: originalRecipe.images, // Copy images or start empty? Spec says "pre-filled".
            image: originalRecipe.image,
            category: originalRecipe.category,
            tags: originalRecipe.tags,
            dietaryTags: originalRecipe.dietaryTags,
            servings: originalRecipe.servings,
            originalRecipeId: originalRecipe._id,
            isPublic: true,
        });

        // Increment fork count on original
        originalRecipe.forkCount += 1;
        await originalRecipe.save({ validateBeforeSave: false });

        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add comment
// @route   POST /api/recipes/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        console.log(`Adding comment to recipe: ${recipe._id} by user ${req.user.id}`);
        const comment = await Comment.create({
            user: req.user.id,
            recipe: recipe._id,
            text: req.body.text,
        });
        console.log(`Comment created with ID: ${comment._id} for recipe: ${comment.recipe}`);

        recipe.commentsCount += 1;
        await recipe.save({ validateBeforeSave: false });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username avatarUrl');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete comment
// @route   DELETE /api/recipes/:id/comments/:commentId
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await comment.deleteOne();

        const recipe = await Recipe.findById(req.params.id);
        if (recipe) {
            recipe.commentsCount = Math.max(0, recipe.commentsCount - 1);
            await recipe.save({ validateBeforeSave: false });
        }

        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get saved recipes
// @route   GET /api/recipes/saved
// @access  Private
const getSavedRecipes = async (req, res) => {
    try {
        const saves = await Save.find({ user: req.user.id }).populate({
            path: 'recipe',
            populate: { path: 'user', select: 'username avatarUrl' }
        });

        const recipes = saves.map(save => save.recipe).filter(recipe => recipe !== null);

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
// @access  Private
const rateRecipe = async (req, res) => {
    try {
        const { score } = req.body;
        if (!score || score < 1 || score > 5) {
            return res.status(400).json({ message: 'Score must be between 1 and 5' });
        }

        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        // Check if user already rated
        let rating = await Rating.findOne({ user: req.user.id, recipe: recipe._id });

        if (rating) {
            // Update existing rating
            rating.score = score;
            await rating.save();
        } else {
            // Create new rating
            rating = await Rating.create({
                user: req.user.id,
                recipe: recipe._id,
                score
            });
        }

        // Recalculate average and distribution
        const ratings = await Rating.find({ recipe: recipe._id });
        const totalScore = ratings.reduce((acc, curr) => acc + curr.score, 0);

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach(r => {
            if (ratingDistribution[r.score] !== undefined) {
                ratingDistribution[r.score]++;
            }
        });

        recipe.ratingsCount = ratings.length;
        recipe.averageRating = totalScore / ratings.length;

        await recipe.save({ validateBeforeSave: false });

        res.status(200).json({
            averageRating: recipe.averageRating,
            ratingsCount: recipe.ratingsCount,
            userRating: score,
            ratingDistribution
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getRecipes,
    getTrendingRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe,
    getSavedRecipes,
    rateRecipe,
    forkRecipe,
    addComment,
    deleteComment,
};
