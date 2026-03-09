import React, { useState, useEffect } from 'react';
import { ChefHat, Eye, Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const StatsCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-100 dark:border-stone-800 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <div>
                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mt-1">{value}</h3>
            </div>
        </div>
        {trend && (
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {trend}
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentRecipes, setRecentRecipes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await api.get('/admin/stats');
                setStats(statsRes.data);
                
                const recipesRes = await api.get('/admin/recipes');
                setRecentRecipes(recipesRes.data.slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                    title="Total Recipes" 
                    value={stats?.totalRecipes || 0} 
                    icon={ChefHat} 
                    color="bg-blue-500" 
                />
                <StatsCard 
                    title="Total Views" 
                    value={stats?.totalViews?.toLocaleString() || 0} 
                    icon={Eye} 
                    color="bg-purple-500" 
                />
                <StatsCard 
                    title="Total Likes" 
                    value={stats?.totalLikes?.toLocaleString() || 0} 
                    icon={Heart} 
                    color="bg-pink-500" 
                />
                <StatsCard 
                    title="Total Users" 
                    value={stats?.totalUsers || 0} 
                    icon={Users} 
                    color="bg-amber-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-100 dark:border-stone-800 shadow-sm">
                    <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4">Recent Recipes</h3>
                    <div className="space-y-4">
                        {recentRecipes.map(recipe => (
                            <div key={recipe._id} className="flex items-center gap-4 p-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 rounded-xl transition-colors">
                                <img src={recipe.image} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-medium text-stone-800 dark:text-stone-200 text-sm">{recipe.title}</h4>
                                    <p className="text-xs text-stone-500 dark:text-stone-400">by {recipe.user?.username || 'Unknown'}</p>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">New</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white flex flex-col justify-center items-start shadow-lg">
                    <h3 className="text-2xl font-bold mb-2">Quick Actions</h3>
                    <p className="text-orange-100 mb-6">Manage your cookbook efficiently.</p>
                    <div className="flex flex-wrap gap-3">
                        <button 
                            onClick={() => navigate('/add-recipe')}
                            className="px-4 py-2 bg-white text-orange-600 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors shadow-sm"
                        >
                            + Add Recipe
                        </button>
                        <button 
                            onClick={() => navigate('/admin/thoughts')}
                            className="px-4 py-2 bg-orange-700/50 text-white rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors backdrop-blur-sm"
                        >
                            Manage Thoughts
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
