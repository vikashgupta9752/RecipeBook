import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Users, UserPlus, UserMinus, Search, UserCheck } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Friends = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('following');
    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchFollowing = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get(`/users/following/${user._id}`);
            setFollowing(res.data);
        } catch (error) {
            console.error('Error fetching following:', error);
        }
    }, [user]);

    const fetchFollowers = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get(`/users/followers/${user._id}`);
            setFollowers(res.data);
        } catch (error) {
            console.error('Error fetching followers:', error);
        }
    }, [user]);

    const fetchSuggestions = useCallback(async () => {
        try {
            const res = await api.get('/users/suggestions');
            setSuggestions(res.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchFollowing();
            fetchFollowers();
            fetchSuggestions();
        }
    }, [user, fetchFollowing, fetchFollowers, fetchSuggestions]);

    const searchUsers = useCallback(async (query) => {
        if (!query.trim()) {
            fetchSuggestions();
            return;
        }
        try {
            const res = await api.get(`/users/search?q=${query}`);
            setSuggestions(res.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    }, [fetchSuggestions]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchUsers(searchTerm);
            } else {
                fetchSuggestions();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchUsers, fetchSuggestions]);

    const handleFollow = async (userId) => {
        try {
            await api.post(`/users/follow/${userId}`);
            // Update local state
            fetchFollowing();
            fetchSuggestions(); // Refresh suggestions
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to follow user');
        }
    };

    const handleUnfollow = async (userId) => {
        if (!confirm('Unfollow this user?')) return;
        try {
            await api.put(`/users/unfollow/${userId}`);
            fetchFollowing();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to unfollow user');
        }
    };

    const UserCard = ({ userData, isFollowingTab = false }) => (
        <div className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-100 dark:border-stone-800 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                <img 
                    src={userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`} 
                    alt={userData.username} 
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-stone-800 dark:text-stone-200 truncate">{userData.username}</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{userData.bio || 'No bio yet'}</p>
            </div>
            {isFollowingTab ? (
                <button
                    onClick={() => handleUnfollow(userData._id)}
                    className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Unfollow"
                >
                    <UserCheck size={20} />
                </button>
            ) : (
                <button
                    onClick={() => handleFollow(userData._id)}
                    className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                    title="Follow"
                >
                    <UserPlus size={20} />
                </button>
            )}
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
                    <Users className="text-orange-600 dark:text-orange-500" size={32} />
                </div>
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">Community</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 mb-6">
                <div className="flex gap-1 p-2">
                    {[
                        { id: 'following', label: `Following (${following.length})` },
                        { id: 'followers', label: `Followers (${followers.length})` },
                        { id: 'find', label: 'Find People' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-orange-500 text-white'
                                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {activeTab === 'following' && (
                    following.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {following.map(u => <UserCard key={u._id} userData={u} isFollowingTab={true} />)}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-stone-500">
                            <p>You are not following anyone yet.</p>
                            <button onClick={() => setActiveTab('find')} className="text-orange-500 font-bold hover:underline mt-2">Find people to follow</button>
                        </div>
                    )
                )}

                {activeTab === 'followers' && (
                    followers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {followers.map(u => (
                                <div key={u._id} className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-100 dark:border-stone-800 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                        <img 
                                            src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                                            alt={u.username} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-stone-800 dark:text-stone-200 truncate">{u.username}</h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{u.bio || 'No bio'}</p>
                                    </div>
                                    {!following.some(f => f._id === u._id) && (
                                        <button
                                            onClick={() => handleFollow(u._id)}
                                            className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                            title="Follow Back"
                                        >
                                            <UserPlus size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-stone-500">
                            <p>No followers yet.</p>
                        </div>
                    )
                )}

                {activeTab === 'find' && (
                    <div>
                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suggestions.map(u => {
                                const isFollowingUser = following.some(f => f._id === u._id);
                                return (
                                    <div key={u._id} className="bg-white dark:bg-stone-900 rounded-xl p-4 border border-stone-100 dark:border-stone-800 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img 
                                                src={u.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} 
                                                alt={u.username} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-stone-800 dark:text-stone-200 truncate">{u.username}</h3>
                                            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{u.bio || 'No bio'}</p>
                                        </div>
                                        {isFollowingUser ? (
                                            <button
                                                onClick={() => handleUnfollow(u._id)}
                                                className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <UserCheck size={20} />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleFollow(u._id)}
                                                className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                                            >
                                                <UserPlus size={20} />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Friends;
