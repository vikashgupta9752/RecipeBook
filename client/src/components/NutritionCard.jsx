import React from 'react';
import { Flame, Dumbbell, Wheat, Activity } from 'lucide-react';

const NutritionCard = ({ nutrition, calories }) => {
  const items = [
    { label: 'Calories', value: calories || 0, icon: <Flame className="text-orange-500" />, unit: 'kcal' },
    { label: 'Protein', value: nutrition?.protein || '0', icon: <Dumbbell className="text-blue-500" />, unit: 'g' },
    { label: 'Carbs', value: nutrition?.carbs || '0', icon: <Wheat className="text-amber-500" />, unit: 'g' },
    { label: 'Fat', value: nutrition?.fat || '0', icon: <Activity className="text-red-500" />, unit: 'g' },
  ];

  return (
    <div className="bg-white dark:bg-stone-900/50 backdrop-blur-xl border border-stone-100 dark:border-stone-800 rounded-3xl p-6 shadow-xl">
      <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-6 flex items-center gap-2">
        <Activity size={20} className="text-orange-500" />
        Nutritional Information
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-100 dark:border-stone-700/50 transition-all hover:scale-[1.02]">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-stone-700 rounded-xl shadow-sm">
                {item.icon}
              </div>
              <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-stone-800 dark:text-stone-100">{item.value}</span>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-tighter">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30">
        <p className="text-xs text-orange-600 dark:text-orange-400 font-medium text-center">
          * Nutritional values are estimated per serving.
        </p>
      </div>
    </div>
  );
};

export default NutritionCard;
