import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, UserPlus, Compass, ChefHat, Sparkles } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import SocialRecipeCard from '../components/SocialRecipeCard';

const Community = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [feedRecipes, setFeedRecipes] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('feed');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch feed or trending based on login status
                let recipesRes;
                if (user) {
                    recipesRes = await api.get('/recipes/feed');
                } else {
                    recipesRes = await api.get('/recipes/trending');
                }
                setFeedRecipes(recipesRes.data);

                // Fetch suggested users if logged in
                if (user) {
                    try {
                        const suggestionsRes = await api.get('/users/suggestions');
                        setSuggestedUsers(suggestionsRes.data);
                    } catch (err) {
                        console.error('Suggestions error:', err);
                    }
                }
            } catch (err) {
                console.error('Feed error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleFollow = async (userId) => {
        if (!user) { navigate('/login'); return; }
        try {
            await api.post(`/users/follow/${userId}`);
            setSuggestedUsers(prev => prev.filter(u => u._id !== userId));
        } catch (err) {
            console.error('Follow error:', err);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 pb-24">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-xl">
                        <Compass size={28} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    Community
                </h1>
                <p className="text-stone-500 dark:text-stone-400 mt-2">Discover recipes from chefs you follow and trending creators</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Feed */}
                <div className="flex-1 min-w-0">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl w-fit">
                        {[
                            { id: 'feed', label: 'Your Feed', icon: <Users size={16} /> },
                            { id: 'trending', label: 'Trending', icon: <TrendingUp size={16} /> },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 shadow-sm'
                                        : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
                                }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden animate-pulse">
                                    <div className="flex items-center gap-3 p-4">
                                        <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-700" />
                                        <div className="flex-1">
                                            <div className="h-4 w-24 bg-stone-200 dark:bg-stone-700 rounded" />
                                            <div className="h-3 w-16 bg-stone-100 dark:bg-stone-800 rounded mt-1" />
                                        </div>
                                    </div>
                                    <div className="aspect-[4/3] bg-stone-200 dark:bg-stone-700" />
                                    <div className="p-4"><div className="h-5 w-48 bg-stone-200 dark:bg-stone-700 rounded" /></div>
                                </div>
                            ))}
                        </div>
                    ) : feedRecipes.length > 0 ? (
                        <div className="space-y-6">
                            {feedRecipes.map((recipe) => (
                                <SocialRecipeCard key={recipe._id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                            <ChefHat size={56} className="text-stone-300 dark:text-stone-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300 mb-2">Your feed is empty</h3>
                            <p className="text-stone-500 dark:text-stone-400 mb-6 max-w-sm mx-auto">
                                Follow other chefs to see their latest recipes here!
                            </p>
                            {!user && (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                                >
                                    Sign in to get started
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar — Suggested Users */}
                {user && suggestedUsers.length > 0 && (
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 p-5 sticky top-24">
                            <h3 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2 mb-4">
                                <Sparkles size={18} className="text-orange-500" />
                                Suggested Chefs
                            </h3>
                            <div className="space-y-4">
                                {suggestedUsers.slice(0, 5).map((sugUser) => (
                                    <div key={sugUser._id} className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer flex-shrink-0 ring-2 ring-stone-100 dark:ring-stone-700 hover:ring-orange-300 dark:hover:ring-orange-700 transition-all"
                                            onClick={() => navigate(`/profile/${sugUser._id}`)}
                                        >
                                            <img
                                                src={sugUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sugUser.username}`}
                                                alt={sugUser.username}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="font-medium text-sm text-stone-800 dark:text-stone-200 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
                                                onClick={() => navigate(`/profile/${sugUser._id}`)}
                                            >
                                                {sugUser.username}
                                            </p>
                                            <p className="text-xs text-stone-400 truncate">
                                                {sugUser.followers?.length || 0} followers
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleFollow(sugUser._id)}
                                            className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors flex-shrink-0"
                                        >
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Community;
