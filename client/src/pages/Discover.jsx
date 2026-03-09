import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import BentoGrid from '../components/BentoGrid';
import FeaturedSlider from '../components/FeaturedSlider';
import api from '../services/api';

const Discover = () => {
    const { searchQuery, dietaryFilter } = useOutletContext();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get('/recipes');
                setRecipes(res.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
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

      const matchesDiet =
  dietaryFilter === 'all'
    ? true
    : dietaryFilter === 'veg'
    ? r.dietaryTags?.includes('veg') || r.dietaryTags?.includes('Vegetarian')
    : r.dietaryTags?.includes('non-veg');


        return matchesSearch && matchesDiet;
    });

    const sliderRecipes = filteredRecipes.slice(0, 5);
    const gridRecipes = filteredRecipes.slice(5);

    const handleRecipeClick = (recipe) => {
        navigate(`/recipes/${recipe._id}`);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            {sliderRecipes.length > 0 && (
                <FeaturedSlider
                    recipes={sliderRecipes}
                    onRecipeClick={handleRecipeClick}
                />
            )}

            <BentoGrid
                recipes={gridRecipes}
                onRecipeClick={handleRecipeClick}
            />
        </div>
    );
};

export default Discover;
