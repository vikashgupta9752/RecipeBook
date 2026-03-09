import React, { useState, useEffect, useContext } from 'react';
import { Calendar, Plus, Trash2, ChefHat, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const MealPlanner = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealPlans, setMealPlans] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState('breakfast');
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [servings, setServings] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

    useEffect(() => {
        fetchMealPlansForDate();
        fetchRecipes();
    }, [selectedDate]);

    const fetchMealPlansForDate = async () => {
        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const res = await api.get(`/meal-plans/date/${dateStr}`);
            setMealPlans(res.data);
        } catch (error) {
            console.error('Error fetching meal plans:', error);
        }
    };

    const fetchRecipes = async () => {
        try {
            const res = await api.get('/recipes');
            setRecipes(res.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    const handleAddMealPlan = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post('/meal-plans', {
                date: selectedDate.toISOString(),
                mealType: selectedMealType,
                recipe: selectedRecipe,
                servings
            });
            
            setShowAddModal(false);
            setSelectedRecipe('');
            setServings(1);
            fetchMealPlansForDate();
        } catch (error) {
            alert('Failed to add meal plan');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMealPlan = async (id) => {
        if (!confirm('Remove this meal from your plan?')) return;

        try {
            await api.delete(`/meal-plans/${id}`);
            fetchMealPlansForDate();
        } catch (error) {
            alert('Failed to delete meal plan');
        }
    };

    const changeDate = (days) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        setSelectedDate(newDate);
    };

    const getMealsByType = (type) => {
        return mealPlans.filter(plan => plan.mealType === type);
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                                <Calendar size={24} className="text-orange-600 dark:text-orange-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Meal Planner</h1>
                                <p className="text-xs text-stone-500 dark:text-stone-400">Plan your weekly meals</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                    >
                        <Plus size={18} />
                        Add Meal
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Date Navigation */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 mb-6 shadow-sm border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => changeDate(-1)}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                        >
                            ← Previous Day
                        </button>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100">
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                            </h2>
                            <p className="text-stone-600 dark:text-stone-400">
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                        <button
                            onClick={() => changeDate(1)}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                        >
                            Next Day →
                        </button>
                    </div>
                </div>

                {/* Meal Types */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mealTypes.map(type => (
                        <div key={type} className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm border border-stone-100 dark:border-stone-800">
                            <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-4 capitalize flex items-center gap-2">
                                <ChefHat size={20} />
                                {type}
                            </h3>
                            
                            {getMealsByType(type).length === 0 ? (
                                <div className="text-center py-8 text-stone-500 dark:text-stone-400">
                                    <p className="text-sm">No meal planned</p>
                                    <button
                                        onClick={() => {
                                            setSelectedMealType(type);
                                            setShowAddModal(true);
                                        }}
                                        className="mt-2 text-orange-600 dark:text-orange-400 text-sm font-medium hover:underline"
                                    >
                                        + Add {type}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {getMealsByType(type).map(plan => (
                                        <div key={plan._id} className="flex items-center gap-3 p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                                            <img 
                                                src={plan.recipe.image} 
                                                alt={plan.recipe.title} 
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-stone-800 dark:text-stone-200">{plan.recipe.title}</h4>
                                                <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                                    <Clock size={12} /> {plan.recipe.time} • {plan.servings} serving(s)
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMealPlan(plan._id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>

            {/* Add Meal Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">Add Meal to Plan</h3>
                        
                        <form onSubmit={handleAddMealPlan} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                                    Meal Type
                                </label>
                                <select
                                    value={selectedMealType}
                                    onChange={(e) => setSelectedMealType(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                                >
                                    {mealTypes.map(type => (
                                        <option key={type} value={type} className="capitalize">{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                                    Recipe
                                </label>
                                <select
                                    value={selectedRecipe}
                                    onChange={(e) => setSelectedRecipe(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                                    required
                                >
                                    <option value="">Select a recipe...</option>
                                    {recipes.map(recipe => (
                                        <option key={recipe._id} value={recipe._id}>{recipe.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                                    Servings
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={servings}
                                    onChange={(e) => setServings(parseInt(e.target.value))}
                                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium disabled:opacity-50"
                                >
                                    {isLoading ? 'Adding...' : 'Add Meal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;
