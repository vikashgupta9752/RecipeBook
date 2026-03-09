import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Settings, UserPlus, LogOut, ChefHat, Search, Filter } from 'lucide-react';
import api from '../services/api';

const GroupDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [group, setGroup] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [friends, setFriends] = useState([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchGroup = async () => {
        try {
            const res = await api.get(`/groups/${id}`);
            setGroup(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchGroupRecipes = async () => {
        try {
            const res = await api.get(`/groups/${id}/recipes`);
            setRecipes(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const res = await api.get('/friends');
            setFriends(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchGroup();
        fetchGroupRecipes();
        fetchFriends();
    }, [id]);

    const handleInvite = async () => {
        try {
            await api.post(`/groups/${id}/invite`, { userIds: selectedFriends });
            setShowInviteModal(false);
            setSelectedFriends([]);
            fetchGroup();
        } catch (error) {
            console.error('Error sending invite:', error);
            alert('Failed to send invitations');
        }
    };

    const handleLeaveGroup = async () => {
        if (!confirm('Leave this group?')) return;
        try {
            await api.delete(`/groups/${id}/leave`);
            navigate('/groups');
        } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave group');
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...new Set(recipes.map(r => r.category).filter(Boolean))];

    if (!group) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const isOwner = group.owner._id === localStorage.getItem('userId');

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-48 relative">
                <button
                    onClick={() => navigate('/groups')}
                    className="absolute top-4 left-4 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-lg hover:bg-white/30"
                >
                    ← Back
                </button>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-24">
                {/* Group Info Card */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-lg mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 mb-2">{group.name}</h1>
                            <p className="text-stone-600 dark:text-stone-400 mb-4">{group.description}</p>
                            <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400">
                                <span className="flex items-center gap-1">
                                    <Users size={16} />
                                    {group.members?.length || 0} members
                                </span>
                                <span>{group.isPrivate ? '🔒 Private' : '🌐 Public'}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isOwner && (
                                <button
                                    onClick={() => setShowInviteModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                >
                                    <UserPlus size={18} />
                                    Invite
                                </button>
                            )}
                            {!isOwner && (
                                <button
                                    onClick={handleLeaveGroup}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    <LogOut size={18} />
                                    Leave
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Members */}
                    <div className="mt-6 border-t border-stone-200 dark:border-stone-800 pt-4">
                        <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">Members</h3>
                        <div className="flex flex-wrap gap-2">
                            {group.members?.map(member => (
                                <div key={member._id} className="flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full">
                                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {member.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm text-stone-700 dark:text-stone-300">{member.username}</span>
                                    {member._id === group.owner._id && (
                                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Owner</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recipes */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">Group Recipes</h2>
                        
                        <div className="flex flex-1 md:max-w-md gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search recipes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border-transparent focus:bg-white dark:focus:bg-stone-700 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 focus:border-purple-300 dark:focus:border-purple-700 transition-all text-sm outline-none"
                                />
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border-transparent focus:bg-white dark:focus:bg-stone-700 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900 outline-none text-sm cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
                            </div>
                            <button
                                onClick={() => navigate('/add-recipe')}
                                className="px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 whitespace-nowrap"
                            >
                                Add Recipe
                            </button>
                        </div>
                    </div>

                    {filteredRecipes.length === 0 ? (
                        <div className="text-center py-12">
                            <ChefHat size={48} className="mx-auto text-stone-400 mb-4" />
                            <p className="text-stone-600 dark:text-stone-400">No recipes found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredRecipes.map(recipe => (
                                <div
                                    key={recipe._id}
                                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                                    className="cursor-pointer bg-stone-50 dark:bg-stone-800 rounded-xl overflow-hidden hover:shadow-lg transition-all"
                                >
                                    <img src={recipe.image} alt={recipe.title} className="w-full h-32 object-cover" />
                                    <div className="p-4">
                                        <h3 className="font-bold text-stone-800 dark:text-stone-200">{recipe.title}</h3>
                                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">by {recipe.user?.username}</p>
                                        {recipe.category && (
                                            <span className="inline-block mt-2 px-2 py-1 bg-stone-200 dark:bg-stone-700 text-xs rounded-md text-stone-600 dark:text-stone-300">
                                                {recipe.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Invite Friends</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                            {friends.map(friend => (
                                <label key={friend._id} className="flex items-center gap-3 p-2 hover:bg-stone-50 dark:hover:bg-stone-800 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFriends.includes(friend._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedFriends([...selectedFriends, friend._id]);
                                            } else {
                                                setSelectedFriends(selectedFriends.filter(id => id !== friend._id));
                                            }
                                        }}
                                    />
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {friend.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{friend.username}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInvite}
                                disabled={selectedFriends.length === 0}
                                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:opacity-50"
                            >
                                Send Invites
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupDetail;
