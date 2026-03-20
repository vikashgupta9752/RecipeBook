import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, ChefHat, Heart, Eye, Users, BookOpen } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [activeTab, setActiveTab] = useState('recipes');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/users/profile/${id}`);
                setProfile(res.data);
                setIsFollowing(res.data.isFollowing);
                setFollowersCount(res.data.followersCount || 0);
                setFollowingCount(res.data.followingCount || 0);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleFollow = async () => {
        if (!currentUser) { navigate('/login'); return; }
        try {
            if (isFollowing) {
                await api.put(`/users/unfollow/${id}`);
                setIsFollowing(false);
                setFollowersCount(prev => Math.max(0, prev - 1));
            } else {
                await api.post(`/users/follow/${id}`);
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            }
        } catch (err) {
            console.error('Follow/Unfollow error:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-stone-500 dark:text-stone-400">User not found</p>
            </div>
        );
    }

    const isOwnProfile = currentUser?._id === id;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24">
            {/* Profile Header */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 overflow-hidden mb-8">
                {/* Banner */}
                <div className="h-32 md:h-40 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 relative">
                    <div className="absolute inset-0 bg-black/10"></div>
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-6 -mt-16 relative">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full border-4 border-white dark:border-stone-900 overflow-hidden bg-stone-200 dark:bg-stone-700 shadow-lg flex-shrink-0">
                            <img
                                src={profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                                alt={profile.username}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 mt-2 md:mt-0 md:mb-1">
                            <h1 className="text-2xl font-bold text-stone-800 dark:text-stone-100">{profile.username}</h1>
                            {profile.bio && (
                                <p className="text-stone-500 dark:text-stone-400 mt-1 text-sm">{profile.bio}</p>
                            )}
                        </div>

                        {/* Follow Button */}
                        {!isOwnProfile && currentUser && (
                            <button
                                onClick={handleFollow}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${
                                    isFollowing
                                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400'
                                        : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {isFollowing ? <><UserMinus size={18} /> Unfollow</> : <><UserPlus size={18} /> Follow</>}
                            </button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{profile.recipes?.length || 0}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">Recipes</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{followersCount}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{followingCount}</p>
                            <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">Following</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 flex items-center gap-2">
                <BookOpen size={20} /> Recipes
            </h3>
            {profile.recipes && profile.recipes.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.recipes.map((recipe) => (
                        <div
                            key={recipe._id}
                            className="group cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:shadow-lg transition-all"
                            onClick={() => navigate(`/recipes/${recipe._id}`)}
                        >
                            <div className="aspect-square overflow-hidden relative">
                                <img
                                    src={recipe.image || recipe.images?.[0]}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => { e.target.src = 'https://placehold.co/300x300?text=🍳'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="flex items-center gap-1 text-white text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                                        <Heart size={12} /> {recipe.likesCount || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-white text-xs bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
                                        <Eye size={12} /> {recipe.views || 0}
                                    </span>
                                </div>
                            </div>
                            <div className="p-3">
                                <h4 className="font-bold text-sm text-stone-800 dark:text-stone-200 line-clamp-1">{recipe.title}</h4>
                                <p className="text-xs text-stone-400 mt-1">{recipe.category}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-stone-50 dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <ChefHat size={48} className="text-stone-300 dark:text-stone-600 mx-auto mb-4" />
                    <p className="text-stone-500 dark:text-stone-400">No recipes yet</p>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
