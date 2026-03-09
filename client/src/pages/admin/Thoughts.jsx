import React, { useState, useEffect, useCallback } from 'react';
import { Lightbulb, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';

const Thoughts = () => {
    const [thoughts, setThoughts] = useState([]);
    const [newThought, setNewThought] = useState({ text: '', author: '' });
    const [editingThought, setEditingThought] = useState(null);

    const fetchThoughts = useCallback(async () => {
        try {
            const res = await api.get('/thoughts');
            setThoughts(res.data);
        } catch (error) {
            console.error('Error fetching thoughts:', error);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            await fetchThoughts();
        };
        loadData();
    }, [fetchThoughts]);

    const handleAddThought = async (e) => {
        e.preventDefault();
        try {
            await api.post('/thoughts', newThought);
            setNewThought({ text: '', author: '' });
            fetchThoughts();
        } catch {
            alert('Error adding thought');
        }
    };

    const handleUpdateThought = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/thoughts/${editingThought._id}`, {
                text: editingThought.text,
                author: editingThought.author,
            });
            setEditingThought(null);
            fetchThoughts();
        } catch {
            alert('Error updating thought');
        }
    };

    const handleDeleteThought = async (id) => {
        if (!window.confirm('Are you sure you want to delete this thought?')) return;
        try {
            await api.delete(`/thoughts/${id}`);
            fetchThoughts();
        } catch {
            alert('Error deleting thought');
        }
    };

    const handleToggleThought = async (thought) => {
        try {
            await api.put(`/thoughts/${thought._id}`, {
                isActive: !thought.isActive,
            });
            fetchThoughts();
        } catch {
            alert('Error toggling thought');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 p-6 transition-colors duration-300">
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">
                    {editingThought ? 'Edit Inspiration' : 'Add New Inspiration'}
                </h2>
                <form onSubmit={editingThought ? handleUpdateThought : handleAddThought}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Quote Text</label>
                            <textarea
                                value={editingThought ? editingThought.text : newThought.text}
                                onChange={(e) => editingThought 
                                    ? setEditingThought({ ...editingThought, text: e.target.value })
                                    : setNewThought({ ...newThought, text: e.target.value })
                                }
                                className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                rows="3"
                                required
                                placeholder="Enter an inspiring cooking quote..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Author</label>
                                <input
                                    type="text"
                                    value={editingThought ? editingThought.author : newThought.author}
                                    onChange={(e) => editingThought
                                        ? setEditingThought({ ...editingThought, author: e.target.value })
                                        : setNewThought({ ...newThought, author: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                    placeholder="Author name (or leave blank for Anonymous)"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-bold shadow-md hover:shadow-lg"
                                >
                                    {editingThought ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </div>
                        {editingThought && (
                            <button
                                type="button"
                                onClick={() => setEditingThought(null)}
                                className="text-sm text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline"
                            >
                                Cancel Editing
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="grid gap-4">
                {thoughts.map((thought) => (
                    <div
                        key={thought._id}
                        className={`bg-white dark:bg-stone-900 rounded-2xl shadow-sm border p-6 transition-all hover:shadow-md ${
                            thought.isActive ? 'border-orange-200 dark:border-orange-900/50 ring-1 ring-orange-100 dark:ring-orange-900/20' : 'border-stone-200 dark:border-stone-800 opacity-75'
                        }`}
                    >
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Lightbulb size={16} className={thought.isActive ? "text-orange-500" : "text-stone-400"} />
                                    <span className={`text-xs font-bold uppercase tracking-wider ${thought.isActive ? "text-orange-600 dark:text-orange-400" : "text-stone-500"}`}>
                                        {thought.isActive ? 'Active Inspiration' : 'Archived'}
                                    </span>
                                </div>
                                <p className="text-lg text-stone-800 dark:text-stone-200 font-serif italic mb-2">"{thought.text}"</p>
                                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">— {thought.author || 'Anonymous'}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleToggleThought(thought)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                                        thought.isActive
                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                            : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                                    }`}
                                >
                                    {thought.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                <div className="flex gap-1 justify-end mt-2">
                                    <button
                                        onClick={() => setEditingThought(thought)}
                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteThought(thought._id)}
                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Thoughts;
