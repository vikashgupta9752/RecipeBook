import React, { useState, useEffect } from 'react';
import { Users, Plus, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newGroup, setNewGroup] = useState({ name: '', description: '', isPrivate: false });
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            const res = await api.get('/groups');
            setGroups(res.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    const createGroup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/groups', newGroup);
            setShowCreateModal(false);
            setNewGroup({ name: '', description: '', isPrivate: false });
            fetchGroups();
        } catch (error) {
            alert('Failed to create group');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                    <Plus size={18} />
                    Create Group
                </button>
            </div>
                {groups.length === 0 ? (
                    <div className="bg-white dark:bg-stone-900 rounded-2xl p-12 text-center">
                        <Users size={48} className="mx-auto text-stone-400 mb-4" />
                        <p className="text-stone-600 dark:text-stone-400 mb-4">No groups yet</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            Create Your First Group
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map(group => (
                            <div
                                key={group._id}
                                onClick={() => navigate(`/groups/${group._id}`)}
                                className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-100 dark:border-stone-800 cursor-pointer hover:shadow-lg transition-all"
                            >
                                <div className="h-32 bg-gradient-to-br from-purple-400 to-pink-500"></div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-2">{group.name}</h3>
                                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">{group.description || 'No description'}</p>
                                    <div className="flex items-center justify-between text-xs text-stone-500">
                                        <span>{group.members?.length || 0} members</span>
                                        <span>{group.isPrivate ? '🔒 Private' : '🌐 Public'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


            {/* Create Group Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Create New Group</h3>
                        <form onSubmit={createGroup} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Group Name</label>
                                <input
                                    type="text"
                                    value={newGroup.name}
                                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={newGroup.description}
                                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={newGroup.isPrivate}
                                    onChange={(e) => setNewGroup({ ...newGroup, isPrivate: e.target.checked })}
                                    className="rounded"
                                />
                                <label className="text-sm">Private Group (invite-only)</label>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Groups;
