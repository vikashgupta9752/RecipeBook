const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    followUser,
    unfollowUser,
    getSuggestedUsers,
    searchUsers,
    getFollowers,
    getFollowing
} = require('../controllers/userController');
const { protect, identify } = require('../middleware/authMiddleware');

router.get('/profile/:id', identify, getUserProfile);
router.post('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/suggestions', protect, getSuggestedUsers);
router.get('/search', searchUsers);
router.get('/followers/:id', getFollowers);
router.get('/following/:id', getFollowing);

module.exports = router;
