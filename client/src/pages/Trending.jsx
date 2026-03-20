import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import BentoGrid from '../components/BentoGrid';
import api from '../services/api';

const Trending = () => {
    const { searchQuery, dietaryFilter } = useOutletContext();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchTrendingRecipes = async () => {
            try {
                const res = await api.get('/recipes/trending');
                setRecipes(res.data);
            } catch (error) {
                console.error('Error fetching trending recipes:', error);
            }
        };
        fetchTrendingRecipes();
    }, []);

    const filteredRecipes = recipes.filter(r => {
        const matchesSearch = searchQuery 
            ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.category?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        
        const vegTags = ['Vegetarian', 'Vegan'];
        const vegKeywords = ['veg', 'paneer', 'pasta', 'dal', 'rice', 'salad', 'fruit', 'eggless', 'cheese', 'pizza', 'sandwich', 'burger', 'maggi', 'noodle', 'veg'];
        const vegCategories = ['Vegetarian', 'Desserts', 'Salad', 'Breakfast', 'Appetizer'];
        
        const isVeg = 
            r.dietaryTags?.some(tag => vegTags.includes(tag)) || 
            vegCategories.includes(r.category) ||
            (r.title && vegKeywords.some(key => r.title.toLowerCase().includes(key.toLowerCase())));

        const matchesDiet = dietaryFilter === 'all' 
            ? true 
            : dietaryFilter === 'veg' 
                ? isVeg 
                : !isVeg;
                
        return matchesSearch && matchesDiet;
    });

    const handleRecipeClick = (recipe) => {
        navigate(`/recipes/${recipe._id}`);
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <BentoGrid 
                recipes={filteredRecipes} 
                onRecipeClick={handleRecipeClick}
                isTrending={true}
            />
        </div>
    );
};

export default Trending;
