import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/activity/notifications');
            setNotifications(res.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id) => {
        try {
            await api.put(`/activity/${id}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put('/activity/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleNotificationClick = (notification) => {
        markAsRead(notification._id);
        
        // Navigate based on notification type
        if (notification.type === 'friend_request') {
            navigate('/friends');
        } else if (notification.type === 'group_invite') {
            navigate('/groups');
        } else if (notification.targetModel === 'Recipe' && notification.targetId) {
            navigate(`/recipe/${notification.targetId}`);
        }
        
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
            >
                <Bell size={22} />
                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setShowDropdown(false)}
                    />
                    
                    {/* Dropdown Panel */}
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 z-50 max-h-[500px] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                            <h3 className="font-bold text-stone-800 dark:text-stone-100">
                                Notifications
                                {notifications.length > 0 && (
                                    <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                                >
                                    <Check size={14} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell size={48} className="mx-auto text-stone-400 mb-3" />
                                    <p className="text-stone-600 dark:text-stone-400">No new notifications</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className="p-4 border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {(notification.actor?.username || '?').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-stone-800 dark:text-stone-200">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                                    {new Date(notification.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    markAsRead(notification._id);
                                                }}
                                                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;
