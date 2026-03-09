import React, { useState, useEffect, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../../services/api';

const Users = () => {
    const [users, setUsers] = useState([]);

    // Memoized fetch function to prevent infinite loops in useEffect
    const fetchUsers = useCallback(async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchUsers();
        };
        loadData();
    }, [fetchUsers]);

    const handleToggleUserStatus = async (user) => {
        try {
            await api.put(`/admin/users/${user._id}`, {
                isSuspended: !user.isSuspended
            });
            fetchUsers();
        } catch {
            alert('Error updating user status');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        
        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch {
            alert('Error deleting user');
        }
    };

    const handlePromoteUser = async (userId) => {
        if (!window.confirm('Promote this user to admin? They will have full access to the admin panel.')) return;
        
        try {
            await api.put(`/admin/users/${userId}`, { isAdmin: true });
            fetchUsers();
        } catch {
            alert('Error promoting user');
        }
    };

    const handleDemoteUser = async (userId) => {
        if (!window.confirm('Demote this admin to regular user? They will lose admin privileges.')) return;
        
        try {
            await api.put(`/admin/users/${userId}`, { isAdmin: false });
            fetchUsers();
        } catch {
            alert('Error demoting user');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden transition-colors duration-300">
                <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">User Management</h2>
                        <p className="text-sm text-stone-600 dark:text-stone-400 mt-1">
                            Manage registered users and their access
                        </p>
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="p-12 text-center text-stone-500 dark:text-stone-400">
                        No users registered yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone-50 dark:bg-stone-800/50">
                                <tr className="text-left text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {u.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-stone-800 dark:text-stone-200">
                                                        {u.username || 'Unknown User'}
                                                    </p>
                                                    <p className="text-xs text-stone-500 dark:text-stone-400">
                                                        ID: {u._id.slice(-6)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-stone-600 dark:text-stone-300">{u.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                u.isAdmin 
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                            }`}>
                                                {u.isAdmin ? '👑 Admin' : 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-stone-600 dark:text-stone-400">
                                                {new Date(u.createdAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                u.isSuspended 
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                                {u.isSuspended ? 'Suspended' : 'Active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {!u.isAdmin ? (
                                                    <button
                                                        onClick={() => handlePromoteUser(u._id)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                                                    >
                                                        Promote
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDemoteUser(u._id)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors"
                                                    >
                                                        Demote
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleToggleUserStatus(u)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        u.isSuspended
                                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                                            : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                    }`}
                                                >
                                                    {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;
