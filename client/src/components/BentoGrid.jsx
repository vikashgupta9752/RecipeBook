import React, { useState } from 'react';
import { Clock, Star, Flame, User, Heart, ArrowRight, ChefHat, Calendar } from 'lucide-react';

const BentoGrid = ({ recipes, onRecipeClick, isTrending }) => {
    if (!recipes || recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-stone-500 dark:text-stone-400">
                <ChefHat size={48} className="mb-4 opacity-20" />
                <p>No recipes found. Be the first to add one!</p>
            </div>
        );
    }

    const [showAll, setShowAll] = useState(false);
    const featured = recipes[0];
    const others = recipes.slice(1);
    const visibleRecipes = showAll ? others : others.slice(0, 9);

    return (
        <div className="p-4 md:p-8 pb-24">
            {/* Responsive Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">

                {/* Featured Recipe - Hero (2x2) */}
                {featured && (
                    <div
                        onClick={() => onRecipeClick(featured)}
                        className="md:col-span-2 md:row-span-2 relative rounded-3xl overflow-hidden cursor-pointer group shadow-lg border border-stone-100 dark:border-stone-800"
                    >
                        <img
                            src={featured.image}
                            alt={featured.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                            <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full mb-3 w-fit shadow-lg animate-fade-in">
                                {isTrending ? '🔥 Trending Now' : '✨ Featured Recipe'}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight line-clamp-2">
                                {featured.title}
                            </h2>
                            <div className="flex items-center gap-3 text-white/90 text-sm flex-wrap">
                                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    <Clock size={14} /> {featured.time}
                                </div>
                                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" /> {featured.averageRating ? featured.averageRating.toFixed(1) : 'New'}
                                </div>
                                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg">
                                    <Heart size={14} /> {featured.likesCount || 0}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recipe Cards in Bento Style */}
                {visibleRecipes.map((recipe, index) => {
                    if (!recipe) return null; // Safety check

                    // Define bento layout patterns
                    let spanClass = 'md:col-span-1 md:row-span-1'; // default 1x1

                    // Bento Pattern for 10 items (Featured + 9)
                    if (index === 0) spanClass = 'md:col-span-2 md:row-span-1'; // Row 1 Right
                    if (index === 3) spanClass = 'md:col-span-2 md:row-span-1'; // Row 3 Left
                    if (index === 7) spanClass = 'md:col-span-2 md:row-span-1'; // Row 4 Middle

                    return (
                        <div
                            key={recipe._id}
                            onClick={() => onRecipeClick(recipe)}
                            className={`${spanClass} group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900`}
                        >
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${recipe.category === 'Breakfast' ? 'bg-amber-500 text-white' :
                                        recipe.category === 'Vegetarian' ? 'bg-green-500 text-white' :
                                            recipe.category === 'Desserts' ? 'bg-pink-500 text-white' :
                                                'bg-orange-500 text-white'
                                        }`}>
                                        {recipe.category}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                                        <span>{recipe.averageRating ? recipe.averageRating.toFixed(1) : 'New'}</span>
                                    </div>
                                </div>
                                <h3 className="text-white font-bold text-base md:text-lg mb-1 line-clamp-2 group-hover:text-orange-300 transition-colors">
                                    {recipe.title}
                                </h3>
                                <div className="flex items-center justify-between text-white/80 text-xs">
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} /> {recipe.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart size={12} /> {recipe.likesCount || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* View More Card - if there are more recipes */}
                {!showAll && others.length > 9 && (
                    <div className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-all hover:scale-[1.02]">
                        <h3 className="text-3xl font-bold mb-2">+{others.length - 9}</h3>
                        <p className="text-orange-100 mb-4 text-center">More delicious recipes to explore</p>
                        <button
                            onClick={() => setShowAll(true)}
                            className="flex items-center gap-2 bg-white text-orange-600 px-6 py-2 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg"
                        >
                            View All <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BentoGrid;
