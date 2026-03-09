import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import BentoGrid from '../components/BentoGrid';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const CuisineRecipes = () => {
    const { type } = useParams();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Capitalize first letter
    const cuisineTitle = type.charAt(0).toUpperCase() + type.slice(1);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const res = await api.get('/recipes');
                // Filter recipes by cuisine tag (case insensitive)
                const filtered = res.data.filter(r =>
                    r.tags?.some(tag => tag.toLowerCase() === type.toLowerCase()) ||
                    r.cuisine?.toLowerCase() === type.toLowerCase() ||
                    r.description?.toLowerCase().includes(type.toLowerCase())
                );
                setRecipes(filtered);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [type]);

    const handleRecipeClick = (recipe) => {
        navigate(`/recipes/${recipe._id}`);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <div className="flex items-center gap-3 text-stone-800 dark:text-stone-100">
                <UtensilsCrossed size={32} className="text-orange-500" />
                <h1 className="text-3xl font-bold">{cuisineTitle} Cuisine</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : recipes.length > 0 ? (
                <BentoGrid
                    recipes={recipes}
                    onRecipeClick={handleRecipeClick}
                />
            ) : (
                <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <UtensilsCrossed size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
                    <p className="text-stone-500 dark:text-stone-400 text-lg">
                        No {cuisineTitle} recipes found yet.
                    </p>
                    <p className="text-stone-400 dark:text-stone-500 text-sm mt-2">
                        Be the first to add one!
                    </p>
                </div>
            )}
        </div>
    );
};

export default CuisineRecipes;
