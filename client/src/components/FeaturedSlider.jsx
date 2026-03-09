import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, Star, Heart } from 'lucide-react';

const FeaturedSlider = ({ recipes, onRecipeClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!recipes || recipes.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recipes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [recipes]);

  if (!recipes || recipes.length === 0) return null;

  const current = recipes[currentIndex];

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-8 group shadow-2xl">
      {/* Background Image */}
      {recipes.map((recipe, index) => (
        <div
          key={recipe._id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          style={{
            backgroundImage: `url(${recipe.image || recipe.images?.[0]})`,
            transform: index === currentIndex ? 'scale(1.05)' : 'scale(1)'
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
        <span className="inline-block px-4 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-full mb-4 animate-fade-in shadow-lg">
          🔥 Trending Now
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl drop-shadow-lg">
          {current.title}
        </h1>
        <p className="text-white/90 mb-6 line-clamp-2 max-w-2xl text-lg drop-shadow-md">
          {current.description}
        </p>

        <div className="flex items-center gap-4 md:gap-6 mb-8 flex-wrap">
          <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <Clock size={18} /> <span className="font-medium">{current.time}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <Star size={18} className="text-yellow-400 fill-yellow-400" /> <span className="font-medium">{current.averageRating ? current.averageRating.toFixed(1) : 'New'}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <Heart size={18} className="text-red-500 fill-red-500" /> <span className="font-medium">{current.likesCount || 0} Likes</span>
          </div>
        </div>

        <button
          onClick={() => onRecipeClick(current)}
          className="bg-white text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
        >
          View Recipe <ArrowRight size={20} />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        {recipes.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-500 w-8' : 'bg-white/50 hover:bg-white w-2'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;
