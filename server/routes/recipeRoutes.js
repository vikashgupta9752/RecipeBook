const express = require('express');
const router = express.Router();
const {
    getRecipes,
    getFeedRecipes,
    getTrendingRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe,
    getSavedRecipes,
    forkRecipe,
    addComment,
    deleteComment,
    rateRecipe,
} = require('../controllers/recipeController');
const { protect, identify } = require('../middleware/authMiddleware');

router.route('/').get(identify, getRecipes).post(protect, createRecipe);
router.get('/trending', getTrendingRecipes);
router.get('/feed', protect, getFeedRecipes);
router.get('/saved', protect, getSavedRecipes);

// Interactions
router.post('/:id/rate', protect, rateRecipe);
router.post('/:id/like', protect, likeRecipe);
router.post('/:id/save', protect, saveRecipe);
router.post('/:id/fork', protect, forkRecipe);

router.route('/:id').get(identify, getRecipe).put(protect, updateRecipe).delete(protect, deleteRecipe);

// Comments
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;
