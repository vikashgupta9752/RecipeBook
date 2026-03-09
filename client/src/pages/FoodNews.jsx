import React, { useMemo } from 'react';
import { Newspaper, Calendar, Lightbulb } from 'lucide-react';
import { newsData, dailyTips } from '../data/newsData';

const FoodNews = () => {
    // Get today's date string (YYYY-MM-DD) to use as a seed
    const today = new Date().toISOString().split('T')[0];

    const dailyContent = useMemo(() => {
        // Simple pseudo-random generator based on date string
        let seed = 0;
        for (let i = 0; i < today.length; i++) {
            seed += today.charCodeAt(i);
        }

        const getRandom = () => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        // Select 6 random news items
        const shuffledNews = [...newsData].sort(() => 0.5 - getRandom());
        const selectedNews = shuffledNews.slice(0, 6);

        // Select 1 random tip
        const tipIndex = Math.floor(getRandom() * dailyTips.length);
        const selectedTip = dailyTips[tipIndex];

        return { news: selectedNews, tip: selectedTip };
    }, [today]);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-stone-800 dark:text-stone-100">
                    <Newspaper size={32} className="text-orange-500" />
                    <h1 className="text-3xl font-bold">Food News</h1>
                </div>
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-4 py-2 rounded-full text-sm">
                    <Calendar size={16} />
                    <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Daily Tip Section */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-2xl p-6 flex items-start gap-4">
                <div className="bg-orange-100 dark:bg-orange-800/40 p-3 rounded-full text-orange-600 dark:text-orange-400 shrink-0">
                    <Lightbulb size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100 mb-1">Tip of the Day</h3>
                    <p className="text-stone-600 dark:text-stone-300">{dailyContent.tip}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dailyContent.news.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-stone-100 dark:border-stone-800 flex flex-col h-full">
                        <div className="h-48 overflow-hidden relative group">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-sm">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="text-xs font-medium text-orange-500 mb-2 uppercase tracking-wide">{item.source}</div>
                            <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-3 line-clamp-2">{item.title}</h3>
                            <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-3 mb-4 flex-grow">{item.summary}</p>
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-orange-500 font-medium text-sm hover:text-orange-600 dark:hover:text-orange-400 self-start transition-colors inline-flex items-center gap-1"
                            >
                                Read Full Story →
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center text-stone-500 dark:text-stone-400 mt-12 border-t border-stone-200 dark:border-stone-800 pt-8">
                <p>Check back tomorrow for fresh news and tips!</p>
            </div>
        </div>
    );
};

export default FoodNews;
