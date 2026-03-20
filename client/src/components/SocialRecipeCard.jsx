import React, { useState, useContext } from 'react';
import { Heart, MessageCircle, Send, Bookmark, Clock, ChefHat, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const SocialRecipeCard = ({ recipe, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(recipe.isLiked || false);
    const [likesCount, setLikesCount] = useState(recipe.likesCount || 0);
    const [isSaved, setIsSaved] = useState(recipe.isSaved || false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        try {
            const res = await api.post(`/recipes/${recipe._id}/like`);
            setIsLiked(res.data.isLiked);
            setLikesCount(res.data.likesCount);
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!user) { navigate('/login'); return; }
        try {
            const res = await api.post(`/recipes/${recipe._id}/save`);
            setIsSaved(res.data.isSaved);
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    const handleShare = (platform, e) => {
        e.stopPropagation();
        const url = `${window.location.origin}/recipes/${recipe._id}`;
        const text = `Check out this recipe: ${recipe.title}`;
        if (platform === 'copy') {
            navigator.clipboard?.writeText(url).then(() => alert('Link copied!'));
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        }
        setShowShareMenu(false);
    };

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden transition-all hover:shadow-lg hover:border-stone-200 dark:hover:border-stone-700">
            {/* Author Header */}
            <div className="flex items-center gap-3 p-4">
                <div
                    className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-orange-200 dark:ring-orange-800 hover:ring-orange-400 dark:hover:ring-orange-600 transition-all"
                    onClick={(e) => { e.stopPropagation(); navigate(`/profile/${recipe.user?._id}`); }}
                >
                    <img
                        src={recipe.user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipe.user?.username || 'User'}`}
                        alt={recipe.user?.username}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p
                        className="font-bold text-sm text-stone-800 dark:text-stone-200 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
                        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${recipe.user?._id}`); }}
                    >
                        {recipe.user?.username || 'Anonymous'}
                    </p>
                    <p className="text-xs text-stone-400">{timeAgo(recipe.createdAt)}</p>
                </div>
                {recipe.cuisine && recipe.cuisine !== 'General' && (
                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full">
                        🌍 {recipe.cuisine}
                    </span>
                )}
            </div>

            {/* Recipe Image */}
            <div
                className="relative w-full aspect-[4/3] cursor-pointer overflow-hidden"
                onClick={() => navigate(`/recipes/${recipe._id}`)}
            >
                <img
                    src={recipe.image || recipe.images?.[0]}
                    alt={recipe.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => { e.target.src = 'https://placehold.co/600x400?text=No+Image'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-lg flex items-center gap-1">
                        <Clock size={12} /> {recipe.timeMinutes || 0}m
                    </span>
                    <span className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs rounded-lg flex items-center gap-1">
                        <ChefHat size={12} /> {recipe.difficulty || 'Medium'}
                    </span>
                </div>
                {recipe.category && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-lg">
                        {recipe.category}
                    </span>
                )}
            </div>

            {/* Action Buttons */}
            <div className="px-4 pt-3 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={handleLike} className="flex items-center gap-1.5 group">
                            <Heart
                                size={22}
                                className={`transition-all group-hover:scale-110 ${isLiked ? 'fill-red-500 text-red-500' : 'text-stone-400 group-hover:text-red-500'}`}
                            />
                            <span className={`text-sm font-medium ${isLiked ? 'text-red-500' : 'text-stone-500 dark:text-stone-400'}`}>
                                {likesCount}
                            </span>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/recipes/${recipe._id}`); }}
                            className="flex items-center gap-1.5 group"
                        >
                            <MessageCircle size={22} className="text-stone-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
                                {recipe.commentsCount || 0}
                            </span>
                        </button>
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
                                className="group"
                            >
                                <Send size={20} className="text-stone-400 group-hover:text-green-500 transition-colors" />
                            </button>
                            {showShareMenu && (
                                <div className="absolute bottom-8 left-0 w-40 bg-white dark:bg-stone-800 rounded-xl shadow-xl border border-stone-100 dark:border-stone-700 overflow-hidden z-50 animate-fade-in">
                                    <button onClick={(e) => handleShare('whatsapp', e)} className="w-full px-4 py-2.5 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm">WhatsApp</button>
                                    <button onClick={(e) => handleShare('twitter', e)} className="w-full px-4 py-2.5 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm">X (Twitter)</button>
                                    <button onClick={(e) => handleShare('copy', e)} className="w-full px-4 py-2.5 text-left hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 text-sm border-t border-stone-100 dark:border-stone-700">Copy Link</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                            <Eye size={14} /> {recipe.views || 0}
                        </span>
                        <button onClick={handleSave} className="group">
                            <Bookmark
                                size={22}
                                className={`transition-all group-hover:scale-110 ${isSaved ? 'fill-orange-500 text-orange-500' : 'text-stone-400 group-hover:text-orange-500'}`}
                            />
                        </button>
                    </div>
                </div>

                {/* Title & Description */}
                <h3
                    className="font-bold text-stone-800 dark:text-stone-100 mb-1 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-1"
                    onClick={() => navigate(`/recipes/${recipe._id}`)}
                >
                    {recipe.title}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                    {recipe.description}
                </p>
            </div>
        </div>
    );
};

export default SocialRecipeCard;
