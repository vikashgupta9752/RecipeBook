import React, { useState, useContext, useEffect } from 'react';
import { ArrowRight, Heart, Clock, Flame, ChefHat, Star, MessageCircle, Users, Eye, Send, Trash2, UserPlus, GitFork, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const RecipeDetail = ({ recipe, onBack, onUpdate, backLabel = 'Back' }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [localRecipe, setLocalRecipe] = useState(recipe);
    const [comment, setComment] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [ratingsCount, setRatingsCount] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());

    useEffect(() => {
        // Reset local data immediately when recipe ID changes to prevent showing old data
        setLocalRecipe(recipe);
        setCheckedIngredients(new Set());

        const fetchRecipeDetails = async () => {
            try {
                const res = await api.get(`/recipes/${recipe._id}`);
                setLocalRecipe(res.data);
                setIsLiked(res.data.isLiked);
                setIsSaved(res.data.isSaved);
                setLikesCount(res.data.likesCount || 0);
                setUserRating(res.data.userRating || 0);
                setAverageRating(res.data.averageRating || 0);
                setRatingsCount(res.data.ratingsCount || 0);
                if (res.data.ratingDistribution) setRatingDistribution(res.data.ratingDistribution);
                if (onUpdate) onUpdate(res.data);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            }
        };
        if (recipe?._id) {
            fetchRecipeDetails();
        }
    }, [recipe._id, onUpdate]);

    const handleBack = (e) => {
        e.preventDefault();
        console.log('Back button clicked');
        if (onBack) {
            onBack();
        } else {
            console.warn('onBack prop is missing');
        }
    };

    const handleShare = async (platform) => {
        const url = window.location.href;
        const text = `Check out this recipe: ${localRecipe.title}`;

        if (platform === 'copy') {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                } else {
                    // Fallback
                    const textArea = document.createElement("textarea");
                    textArea.value = url;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        alert('Link copied to clipboard!');
                    } catch (err) {
                        console.error('Fallback: Oops, unable to copy', err);
                        alert('Failed to copy link manually.');
                    }
                    document.body.removeChild(textArea);
                }
            } catch (err) {
                console.error('Failed to copy:', err);
                alert('Failed to copy link.');
            }
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        } else if (platform === 'instagram') {
            // Instagram doesn't have a direct share URL for text/links in the same way, usually just opens the app
            alert('Open Instagram to share!');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        }

        setShowShareMenu(false);
    };

    if (!localRecipe) return null;

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const response = await api.post(`/recipes/${localRecipe._id}/like`);
            setIsLiked(response.data.isLiked);
            setLikesCount(response.data.likesCount);

            // Notify parent of update
            if (onUpdate) {
                onUpdate({
                    ...localRecipe,
                    likesCount: response.data.likesCount,
                    isLiked: response.data.isLiked
                });
            }
        } catch (error) {
            console.error('Error liking recipe:', error);
        }
    };

    const handleSave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const response = await api.post(`/recipes/${localRecipe._id}/save`);
            setIsSaved(response.data.isSaved);

            // Notify parent of update
            if (onUpdate) {
                onUpdate({
                    ...localRecipe,
                    savesCount: response.data.savesCount, // Assuming API returns this
                    isSaved: response.data.isSaved
                });
            }
        } catch (error) {
            console.error('Error saving recipe:', error);
        }
    };

    const handleRate = async (score) => {
        console.log('handleRate called with score:', score);
        if (!user) {
            navigate('/login');
            return;
        }

        // Optimistic Update
        const prevRating = userRating;
        setUserRating(score);

        try {
            const response = await api.post(`/recipes/${localRecipe._id}/rate`, { score });
            setUserRating(response.data.userRating);
            setAverageRating(response.data.averageRating);
            setRatingsCount(response.data.ratingsCount);
            if (response.data.ratingDistribution) setRatingDistribution(response.data.ratingDistribution);
        } catch (error) {
            console.error('Error rating recipe:', error);
            alert('Failed to submit rating. Please try again.');
            setUserRating(prevRating); // Rollback
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (!comment.trim()) return;

        try {
            const response = await api.post(`/recipes/${localRecipe._id}/comments`, { text: comment });
            // Response is the new comment object
            const newComment = response.data;
            setLocalRecipe(prev => ({
                ...prev,
                comments: [newComment, ...(prev.comments || [])],
                commentsCount: (prev.commentsCount || 0) + 1
            }));
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await api.delete(`/recipes/${localRecipe._id}/comments/${commentId}`);
            setLocalRecipe(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c._id !== commentId),
                commentsCount: Math.max(0, (prev.commentsCount || 0) - 1)
            }));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleFork = async () => {
        console.log('handleFork called', { user, recipeId: localRecipe._id });
        if (!user) {
            navigate('/login');
            return;
        }
        if (!confirm('Fork this recipe? This will create a copy in your recipes.')) {
            console.log('Fork cancelled by user');
            return;
        }

        try {
            console.log('Sending fork request...');
            await api.post(`/recipes/${localRecipe._id}/fork`);
            console.log('Fork successful');
            alert(`Recipe forked successfully! You can find it in My Recipes.`);
        } catch (error) {
            console.error('Error forking recipe:', error);
            alert('Error forking recipe');
        }
    };

    const handleIngredientToggle = (index) => {
        setCheckedIngredients(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    const allIngredientsChecked = localRecipe.ingredients && localRecipe.ingredients.length > 0 && checkedIngredients.size === localRecipe.ingredients.length;

    return (
        <div className="h-screen overflow-y-auto p-4 md:p-8 bg-white dark:bg-stone-900 animate-fade-in transition-colors duration-300">
            <button type="button" onClick={handleBack} className="mb-6 flex items-center gap-2 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors">
                <ArrowRight className="rotate-180" size={20} />
                {backLabel}
            </button>

            <div className="max-w-6xl mx-auto">
                {localRecipe.originalRecipeId && (
                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl flex items-center gap-2 text-sm">
                        <GitFork size={16} />
                        Forked from <span className="font-bold">{localRecipe.originalRecipeId.title}</span> by {localRecipe.originalRecipeId.user?.username || 'Unknown'}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Left Column: Image */}
                    <div className="rounded-3xl overflow-hidden h-[400px] md:h-[500px] shadow-lg relative group">
                        <img
                            src={localRecipe.image || localRecipe.images?.[0]}
                            alt={localRecipe.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                        <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-lg">
                                <Clock size={18} />
                                <span className="font-bold">{localRecipe.timeMinutes || 0} min</span>
                            </div>
                            <button
                                onClick={() => document.getElementById('rating-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-lg hover:bg-white/30 transition-colors cursor-pointer"
                            >
                                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{averageRating > 0 ? averageRating.toFixed(1) : 'Rate'}</span>
                            </button>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/10 rounded-xl text-white shadow-lg">
                                <Heart size={18} className="text-red-500 fill-red-500" />
                                <span className="font-bold">{likesCount} Likes</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-wrap gap-2">
                                {localRecipe.category && (
                                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-medium rounded-full">
                                        {localRecipe.category}
                                    </span>
                                )}
                                {localRecipe.dietaryTags && localRecipe.dietaryTags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
                                        {tag}
                                    </span>
                                ))}
                                {localRecipe.tags && localRecipe.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLike}
                                    className={`p-3 bg-stone-100 dark:bg-stone-800 rounded-full cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-all ${isLiked ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}
                                    title="Like"
                                >
                                    <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
                                </button>
                                <button
                                    onClick={handleSave}
                                    className={`p-3 bg-stone-100 dark:bg-stone-800 rounded-full cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-all ${isSaved ? 'text-orange-500' : 'text-stone-400 hover:text-orange-500'}`}
                                    title={isSaved ? "Remove from Favorites" : "Add to Favorites"}
                                >
                                    <Bookmark size={20} className={isSaved ? 'fill-orange-500' : ''} />
                                </button>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="p-3 bg-stone-100 dark:bg-stone-800 rounded-full cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-all text-stone-400 hover:text-blue-500"
                                        title="Share"
                                    >
                                        <Send size={20} />
                                    </button>
                                    {showShareMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-100 dark:border-stone-700 overflow-hidden animate-fade-in z-50">
                                            <button
                                                onClick={() => handleShare('whatsapp')}
                                                className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm font-medium flex items-center gap-2"
                                            >
                                                WhatsApp
                                            </button>
                                            <button
                                                onClick={() => handleShare('instagram')}
                                                className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm font-medium flex items-center gap-2"
                                            >
                                                Instagram
                                            </button>
                                            <button
                                                onClick={() => handleShare('twitter')}
                                                className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm font-medium flex items-center gap-2"
                                            >
                                                X (Twitter)
                                            </button>
                                            <button
                                                onClick={() => handleShare('copy')}
                                                className="w-full px-4 py-3 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm font-medium flex items-center gap-2 border-t border-stone-100 dark:border-stone-700"
                                            >
                                                Copy Link
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-stone-800 dark:text-stone-100 mb-4">{localRecipe.title}</h1>
                        <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-6">{localRecipe.description}</p>

                        {/* Author info */}
                        <div
                            className="flex items-center gap-3 mb-6 p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-100 dark:border-stone-700 cursor-pointer hover:border-orange-200 dark:hover:border-orange-800 transition-all"
                            onClick={() => localRecipe.user?._id && navigate(`/profile/${localRecipe.user._id}`)}
                        >
                            <div className="w-10 h-10 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-orange-300 transition-all">
                                <img src={localRecipe.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${localRecipe.user?.username || 'User'}`} alt="Author" />
                            </div>
                            <div>
                                <p className="text-sm text-stone-500 dark:text-stone-400">Recipe by</p>
                                <p className="font-bold text-stone-800 dark:text-stone-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">{localRecipe.user?.username || 'Anonymous'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { label: 'Time', val: `${localRecipe.timeMinutes || 0} min`, icon: <Clock size={18} /> },
                                { label: 'Calories', val: localRecipe.calories, icon: <Flame size={18} /> },
                                { label: 'Difficulty', val: localRecipe.difficulty, icon: <ChefHat size={18} /> }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200">
                                    {stat.icon}
                                    <span className="font-bold mt-1">{stat.val}</span>
                                    <span className="text-xs opacity-70">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 mb-6">
                            <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                                <Heart size={18} className="text-red-500" />
                                <span className="font-medium">{likesCount}</span> Likes
                            </div>
                            <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                                <Eye size={18} className="text-blue-500" />
                                <span className="font-medium">{localRecipe.views || 0}</span> Views
                            </div>
                            <div className="flex items-center gap-1 text-stone-500 dark:text-stone-400">
                                <MessageCircle size={18} className="text-green-500" />
                                <span className="font-medium">{localRecipe.commentsCount || localRecipe.comments?.length || 0}</span> Comments
                            </div>
                        </div>

                        {/* Fork Button */}
                        <button
                            onClick={handleFork}
                            className="w-full mt-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-medium shadow-lg hover:shadow-xl"
                        >
                            <GitFork size={20} />
                            Fork Recipe
                            {localRecipe.forkCount > 0 && (
                                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                    {localRecipe.forkCount} forks
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">Ingredients</h3>
                        <div className="space-y-3">
                            {localRecipe.ingredients && localRecipe.ingredients.map((ing, i) => (
                                <label key={i} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${checkedIngredients.has(i) ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'hover:bg-stone-50 dark:hover:bg-stone-800 border-transparent hover:border-stone-100 dark:hover:border-stone-700'}`}>
                                    <input
                                        type="checkbox"
                                        checked={checkedIngredients.has(i)}
                                        onChange={() => handleIngredientToggle(i)}
                                        className="w-5 h-5 rounded-md border-stone-300 dark:border-stone-600 text-orange-500 focus:ring-orange-500 bg-white dark:bg-stone-800"
                                    />
                                    <span className={`text-stone-700 dark:text-stone-300 font-medium ${checkedIngredients.has(i) ? 'line-through opacity-70' : ''}`}>
                                        {typeof ing === 'string' ? ing : `${ing.quantity} ${ing.unit} ${ing.name}`}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {allIngredientsChecked && (
                            <div className="mt-6 p-6 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/40 dark:to-amber-900/40 rounded-2xl border border-orange-200 dark:border-orange-800 text-center animate-fade-in">
                                <div className="flex justify-center mb-3">
                                    <ChefHat size={32} className="text-orange-600 dark:text-orange-400" />
                                </div>
                                <h4 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">
                                    Feeling hungry? Turn your ingredients into magic!
                                </h4>
                                <p className="text-orange-700 dark:text-orange-300 mb-4 text-sm">
                                    You have everything you need. Let's get cooking!
                                </p>
                                {!isSaved && (
                                    <p className="text-orange-600 dark:text-orange-400 font-medium animate-pulse">
                                        Click the button to save!
                                    </p>
                                )}
                                {isSaved && (
                                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-full font-bold shadow-md">
                                        <Bookmark size={18} className="fill-white" />
                                        Saved to Favorites!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-4">Instructions</h3>
                        <div className="space-y-6">
                            {localRecipe.steps && localRecipe.steps.map((step, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-800 dark:bg-stone-700 text-white flex items-center justify-center font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-stone-700 dark:text-stone-300 leading-relaxed pt-1">
                                            {typeof step === 'string' ? step : step.text}
                                        </p>
                                        {step.timeMinutes > 0 && (
                                            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
                                                <Clock size={12} />
                                                {step.timeMinutes} min
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comments Section */}
                        <div className="mt-12 p-6 bg-stone-50 dark:bg-stone-800 rounded-3xl border border-stone-100 dark:border-stone-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <h4 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                                    <MessageCircle size={20} />
                                    Comments ({localRecipe.commentsCount || localRecipe.comments?.length || 0})
                                </h4>

                                {/* Rating UI */}
                                <div id="rating-section" className="flex flex-col gap-6 p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-700 w-full md:w-auto relative z-20">
                                    <div className="flex gap-8 items-start">
                                        {/* Left: Big Rating */}
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-6xl font-bold text-stone-800 dark:text-stone-100">
                                                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
                                            </span>
                                            <div className="flex items-center gap-1 my-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        size={16}
                                                        className={`${star <= Math.round(averageRating)
                                                            ? 'fill-green-600 text-green-600'
                                                            : 'text-stone-300 dark:text-stone-600'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-stone-500 dark:text-stone-400">
                                                {ratingsCount} reviews
                                            </span>
                                        </div>

                                        {/* Right: Progress Bars */}
                                        <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = ratingDistribution[star] || 0;
                                                const percentage = ratingsCount > 0 ? (count / ratingsCount) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3 text-sm">
                                                        <span className="w-3 font-medium text-stone-600 dark:text-stone-400">{star}</span>
                                                        <div className="flex-1 h-2.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-green-600 rounded-full transition-all duration-500"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* User Rating Input */}
                                    <div className="pt-4 border-t border-stone-100 dark:border-stone-700">
                                        <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wider">Rate this recipe</p>
                                        <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div
                                                    key={star}
                                                    onClick={() => {
                                                        console.log('Star clicked:', star);
                                                        handleRate(star);
                                                    }}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110 p-1 relative z-50 cursor-pointer"
                                                    role="button"
                                                    tabIndex={0}
                                                >
                                                    <Star
                                                        size={32}
                                                        className={`${star <= (hoverRating || userRating)
                                                            ? 'fill-green-600 text-green-600'
                                                            : 'text-stone-300 dark:text-stone-600'
                                                            } transition-colors`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleAddComment} className="mb-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-300 outline-none"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center gap-2"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>

                            {/* Comments list */}
                            <div className="space-y-4">
                                {localRecipe.comments && localRecipe.comments.length > 0 ? (
                                    localRecipe.comments.map((c) => (
                                        <div key={c._id} className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-700">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-8 h-8 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center overflow-hidden">
                                                        <img src={c.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.username || 'User'}`} alt={c.user?.username} />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-stone-800 dark:text-stone-200">{c.user?.username || c.username}</p>
                                                        <p className="text-xs text-stone-400">{new Date(c.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {(c.user?._id === user?._id || c.user === user?._id) && (
                                                    <button
                                                        onClick={() => handleDeleteComment(c._id)}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-stone-700 dark:text-stone-300">{c.text}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-stone-500 dark:text-stone-400 text-center italic">No comments yet. Be the first to comment!</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default RecipeDetail;
