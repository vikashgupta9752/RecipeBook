import React, { useState, useEffect, useContext } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, GitFork, Check } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [user]);

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, read: true } : n)
            );
        } catch (error) {
            console.error('Error marking read:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all read:', error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'like': return <Heart size={20} className="text-red-500 fill-red-500" />;
            case 'comment': return <MessageCircle size={20} className="text-blue-500 fill-blue-500" />;
            case 'fork': return <GitFork size={20} className="text-purple-500" />;
            case 'follow': return <UserPlus size={20} className="text-green-500" />;
            default: return <Bell size={20} className="text-orange-500" />;
        }
    };

    const getMessage = (n) => {
        const senderName = n.sender?.username || 'Someone';
        const recipeTitle = n.recipe?.title || 'a recipe';

        switch (n.type) {
            case 'like': return <span><span className="font-bold">{senderName}</span> liked your recipe <span className="font-bold">{recipeTitle}</span></span>;
            case 'comment': return <span><span className="font-bold">{senderName}</span> commented on <span className="font-bold">{recipeTitle}</span></span>;
            case 'fork': return <span><span className="font-bold">{senderName}</span> forked your recipe <span className="font-bold">{recipeTitle}</span></span>;
            case 'follow': return <span><span className="font-bold">{senderName}</span> started following you</span>;
            default: return <span>New notification</span>;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-stone-500">Loading notifications...</div>;
    }

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto pb-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100 flex items-center gap-3">
                    <Bell className="text-orange-500" /> Notifications
                </h1>
                {notifications.some(n => !n.read) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                    >
                        <Check size={16} /> Mark all as read
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 bg-stone-50 dark:bg-stone-800 rounded-3xl">
                        <Bell size={48} className="mx-auto text-stone-300 mb-4" />
                        <p className="text-stone-500">No notifications yet</p>
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n._id}
                            onClick={() => {
                                if (!n.read) handleMarkRead(n._id);
                                if (n.recipe) navigate(`/recipes/${n.recipe._id}`);
                            }}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border ${n.read
                                ? 'bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800'
                                : 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30 shadow-sm'
                                } hover:shadow-md`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                                    <img src={n.sender?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${n.sender?.username}`} alt="User" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-stone-800 rounded-full p-1 shadow-sm">
                                    {getIcon(n.type)}
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-stone-800 dark:text-stone-200 text-sm md:text-base">
                                    {getMessage(n)}
                                </p>
                                <p className="text-xs text-stone-400 mt-1">
                                    {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            {!n.read && (
                                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
