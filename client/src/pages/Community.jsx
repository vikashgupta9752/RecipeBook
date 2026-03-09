import React from 'react';
import ActivityFeed from '../components/ActivityFeed';

const Community = () => {
    return (
        <div className="p-6 md:p-8 max-w-3xl mx-auto pb-24">
            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6">Community Activity</h2>
            <ActivityFeed />
        </div>
    );
};

export default Community;
