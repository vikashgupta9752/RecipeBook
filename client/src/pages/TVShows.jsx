import React from 'react';
import { Tv, Star, ExternalLink, Play } from 'lucide-react';
import { tvShowsData } from '../data/tvShowsData';

const TVShows = () => {
    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <div className="flex items-center gap-3 text-stone-800 dark:text-stone-100">
                <Tv size={32} className="text-orange-500" />
                <h1 className="text-3xl font-bold">TV Shows</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tvShowsData.map((show) => (
                    <a
                        key={show.id}
                        href={show.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-800 group flex flex-col h-full transform hover:-translate-y-1"
                    >
                        <div className="h-56 relative overflow-hidden">
                            <img
                                src={show.image}
                                alt={show.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30">
                                    <Play size={32} className="text-white fill-white ml-1" />
                                </div>
                            </div>

                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                <Star size={12} fill="currentColor" />
                                <span>{show.rating}</span>
                            </div>

                            <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {show.network}
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow relative">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 group-hover:text-orange-500 transition-colors">
                                    {show.title}
                                </h3>
                                <ExternalLink size={16} className="text-stone-400 group-hover:text-orange-500 transition-colors mt-1" />
                            </div>

                            <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-3 mb-4 flex-grow">
                                {show.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-medium text-stone-500 dark:text-stone-400">
                                <span>Watch Now</span>
                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <div className="text-center text-stone-500 dark:text-stone-400 mt-12 border-t border-stone-200 dark:border-stone-800 pt-8">
                <p>New shows added regularly!</p>
            </div>
        </div>
    );
};

export default TVShows;
