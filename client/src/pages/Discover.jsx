import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Clock, Utensils, Star, ChevronRight } from 'lucide-react';
import BentoGrid from '../components/BentoGrid';
import FeaturedSlider from '../components/FeaturedSlider';
import api from '../services/api';

const Discover = () => {
    const { searchQuery, setSearchQuery, dietaryFilter } = useOutletContext();
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await api.get('/recipes');
                setRecipes(res.data);
            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    const categories = [
        { name: 'All', icon: <Utensils size={16} /> },
        { name: 'Breakfast', icon: '🍳' },
        { name: 'Main Course', icon: '🍱' },
        { name: 'Vegetarian', icon: '🥗' },
        { name: 'Desserts', icon: '🍰' },
        { name: 'Seafood', icon: '🐟' },
        { name: 'Appetizer', icon: '🥨' }
    ];

    const filteredRecipes = recipes.filter(r => {
        const matchesSearch = searchQuery
            ? r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.category?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        const vegTags = ['Vegetarian', 'Vegan'];
        const vegKeywords = ['veg', 'paneer', 'pasta', 'dal', 'rice', 'salad', 'fruit', 'eggless', 'cheese', 'pizza', 'sandwich', 'burger', 'maggi', 'noodle'];
        const vegCategories = ['Vegetarian', 'Desserts', 'Salad', 'Breakfast', 'Appetizer'];
        
        const isVeg = 
            r.dietaryTags?.some(tag => vegTags.includes(tag)) || 
            vegCategories.includes(r.category) ||
            (r.title && vegKeywords.some(key => r.title.toLowerCase().includes(key.toLowerCase())));

        const matchesDiet =
            dietaryFilter === 'all'
                ? true
                : dietaryFilter === 'veg'
                ? isVeg
                : !isVeg;

        return matchesSearch && matchesDiet;
    });

    const sliderRecipes = filteredRecipes.slice(0, 5);
    const gridRecipes = filteredRecipes.slice(5);

    const handleRecipeClick = (recipe) => {
        navigate(`/recipes/${recipe._id}`);
    };

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 trasition-colors duration-300">
            
            {/* HERO SECTION */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
                {/* Background with parallax effect simulation */}
                <div className="absolute inset-0 z-0 scale-110">
                    <img 
                        src="/assets/hero_food_background.png" 
                        alt="Gourmet Food" 
                        className="w-full h-full object-cover blur-[2px] opacity-90 dark:opacity-70 dark:brightness-75 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-stone-50 dark:to-stone-950" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-sm font-medium animate-fade-in mb-4">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span>Discover over 1,000+ premium recipes</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight drop-shadow-2xl">
                        Unleash Your Inner <span className="text-orange-400 italic">Chef</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-stone-100/90 max-w-2xl mx-auto font-medium drop-shadow-md">
                        The ultimate destination for food lovers. Find inspiration, share your creations, and join a global community of culinary artists.
                    </p>

                    {/* Integrated Search Bar */}
                    <div className="relative max-w-2xl mx-auto pt-4 group">
                        <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative flex items-center bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-2 border border-stone-200 dark:border-stone-800 transition-all duration-300 hover:scale-[1.02]">
                            <Search className="ml-4 text-stone-400" size={24} />
                            <input 
                                type="text" 
                                placeholder="Search recipes, cuisines, or ingredients..."
                                value={searchQuery || ''}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-transparent outline-none text-stone-800 dark:text-stone-100 text-lg placeholder-stone-400"
                            />
                            <button className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95">
                                Search <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK CATEGORIES */}
            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200 dark:border-stone-800 rounded-3xl p-4 md:p-6 shadow-2xl flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 font-bold text-stone-400 dark:text-stone-500 whitespace-nowrap border-r border-stone-200 dark:border-stone-800 pr-4 md:pr-8">
                        <TrendingUp size={20} className="text-orange-500" />
                        Quick Browse
                    </div>
                    <div className="flex gap-4">
                        {categories.map((cat, idx) => (
                            <Link 
                                key={idx}
                                to={cat.name === 'All' ? '/' : `/category/${cat.name}`}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all duration-300 whitespace-nowrap font-semibold text-stone-700 dark:text-stone-300 shadow-sm"
                            >
                                <span className="text-lg">{cat.icon}</span>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-16 pb-24 mt-8">
                
                {/* SECTION: TRENDING SLIDER */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100 flex items-center gap-3">
                                <span className="p-2 bg-orange-500/10 rounded-xl"><Clock className="text-orange-500" size={24} /></span>
                                Popular This Week
                            </h2>
                            <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">Most saved and liked recipes by the community</p>
                        </div>
                        <Link to="/trending" className="flex items-center gap-1 text-orange-500 font-bold hover:gap-2 transition-all">
                            View All <ChevronRight size={18} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="w-full h-[400px] md:h-[500px] bg-stone-200 dark:bg-stone-800 animate-pulse rounded-3xl" />
                    ) : (
                        sliderRecipes.length > 0 && (
                            <FeaturedSlider
                                recipes={sliderRecipes}
                                onRecipeClick={handleRecipeClick}
                            />
                        )
                    )}
                </div>

                {/* SECTION: BENTO GRID */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-stone-800 dark:text-stone-100 flex items-center gap-3">
                                <span className="p-2 bg-orange-500/10 rounded-xl"><Utensils className="text-orange-500" size={24} /></span>
                                Explore Recipes
                            </h2>
                            <p className="text-stone-500 dark:text-stone-400 mt-1 font-medium">Diverse flavors from all over the world</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-48 bg-stone-200 dark:bg-stone-800 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <BentoGrid
                            recipes={gridRecipes}
                            onRecipeClick={handleRecipeClick}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Discover;
