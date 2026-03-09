import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import BentoGrid from '../components/BentoGrid';
import RecipeDetail from '../components/RecipeDetail';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const Favorites = () => {
    const { searchQuery, dietaryFilter } = useOutletContext();
    const { user } = useContext(AuthContext);
    const [recipes, setRecipes] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get('/recipes/saved');
                if (Array.isArray(res.data)) {
                    setRecipes(res.data);
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
        </div>
    );
};

export default Favorites;
