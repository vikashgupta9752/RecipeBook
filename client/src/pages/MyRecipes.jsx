import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import BentoGrid from '../components/BentoGrid';
import RecipeDetail from '../components/RecipeDetail';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const MyRecipes = () => {
    const { searchQuery, dietaryFilter } = useOutletContext();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get('/recipes');
                // Ensure we have an array and filter out any null/undefined items
                if (Array.isArray(res.data)) {
                    setRecipes(res.data.filter(r => r));
                } else {
                    setRecipes([]);
                }
            } catch (error) {
                console.error('Error fetching recipes:', error);
                setRecipes([]);
            }
        };
        fetchRecipes();
    }, []);

    const filteredRecipes = recipes.filter(r => {
        const isMyRecipe = (r.user?._id || r.user) === user?._id;
        if (!isMyRecipe) return false;

        const matchesSearch = searchQuery
            ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.category?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        const matchesDiet = dietaryFilter === 'all'
            ? true
            : dietaryFilter === 'veg'
                ? r.isVegetarian
                : !r.isVegetarian;

        return matchesSearch && matchesDiet;
    });

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <BentoGrid
                recipes={filteredRecipes}
                onRecipeClick={setSelectedRecipe}
            />

            {selectedRecipe && (
                <RecipeDetail
                    recipe={selectedRecipe}
                    onBack={() => setSelectedRecipe(null)}
                    backLabel="Close"
                    onUpdate={(updated) => {
                        setRecipes(recipes.map(r => r._id === updated._id ? updated : r));
                        setSelectedRecipe(updated);
                    }}
                />
            )}

            <button
                onClick={() => navigate('/add-recipe')}
                className="fixed bottom-8 right-8 p-4 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110 z-40"
                title="Add New Recipe"
            >
                <Plus size={24} />
            </button>
        </div>
    );
};

export default MyRecipes;
