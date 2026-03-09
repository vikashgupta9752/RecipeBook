import React, { useState, useEffect } from 'react';
import { Clock, UserPlus, Users, GitFork, MessageCircle, ChefHat } from 'lucide-react';
import api from '../services/api';

const ActivityFeed = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivityFeed();
    }, []);

    const fetchActivityFeed = async () => {
        try {
            const res = await api.get('/activity/feed');
            setActivities(res.data);
        } catch (error) {
            console.error('Error fetching activity feed:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'friend_request':
            case 'friend_accepted':
                return <UserPlus size={16} className="text-blue-500" />;
            case 'group_invite':
            case 'group_joined':
                return <Users size={16} className="text-purple-500" />;
            case 'recipe_forked':
                return <GitFork size={16} className="text-pink-500" />;
            case 'comment_added':
                return <MessageCircle size={16} className="text-green-500" />;
            default:
                return <ChefHat size={16} className="text-orange-500" />;
        }
    };

    if (loading) return <div className="p-4 text-center text-stone-500">Loading activity...</div>;

    if (activities.length === 0) {
        return (
            <div className="p-6 text-center bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                <p className="text-stone-500 dark:text-stone-400">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800">
                <h3 className="font-bold text-stone-800 dark:text-stone-100 flex items-center gap-2">
                    <Clock size={18} className="text-orange-500" />
                    Recent Activity
                </h3>
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 max-h-[400px] overflow-y-auto">
                {activities.map((activity) => (
                    <div key={activity._id} className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 bg-stone-100 dark:bg-stone-800 rounded-full">
                                {getActivityIcon(activity.type)}
                            </div>
                            <div>
                                <p className="text-sm text-stone-800 dark:text-stone-200">
                                    <span className="font-semibold">{activity.actor?.username || 'Unknown User'}</span> {activity.message}
                                </p>
                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                                    {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;
