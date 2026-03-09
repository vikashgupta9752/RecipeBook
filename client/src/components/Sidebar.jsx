import React, { useContext, useState, useEffect } from 'react';
import {
  Search,
  ChefHat,
  Heart,
  X,
  TrendingUp,
  Shield,
  Newspaper,
  Tv,
  UtensilsCrossed,
  ChevronDown,
  ChevronRight,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const Sidebar = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [dailyThought, setDailyThought] = useState(null);
  const [cuisinesOpen, setCuisinesOpen] = useState(false);

  useEffect(() => {
    const fetchDailyThought = async () => {
      try {
        const res = await api.get('/thoughts/today');
        setDailyThought(res.data);
      } catch (err) {
        console.error('Error fetching daily thought:', err);
      }
    };
    fetchDailyThought();
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-600 font-bold text-xl">
            <ChefHat />
            <span>CookBook</span>
          </div>
          <button onClick={toggleSidebar} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto">

          {/* USER MENU */}
          {[
            { id: 'discover', label: 'Discover', icon: <Search size={20} /> },
            { id: 'trending', label: 'Trending', icon: <TrendingUp size={20} /> },
            { id: 'food-news', label: 'Food News', icon: <Newspaper size={20} /> },
            { id: 'tv-shows', label: 'TV Shows', icon: <Tv size={20} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                toggleSidebar();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${
                activeTab === item.id
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* CUISINES */}
          <button
            onClick={() => setCuisinesOpen(!cuisinesOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
          >
            <div className="flex items-center gap-3">
              <UtensilsCrossed size={20} />
              <span>Cuisines</span>
            </div>
            {cuisinesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {cuisinesOpen && (
            <div className="ml-4 pl-4 border-l border-stone-200 dark:border-stone-800">
              {['Indian', 'Italian', 'Chinese', 'South Indian', 'Mexican', 'Thai'].map(cuisine => (
                <button
                  key={cuisine}
                  onClick={() => {
                    navigate(`/cuisines/${cuisine.toLowerCase()}`);
                    toggleSidebar();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm hover:text-orange-600"
                >
                  {cuisine}
                </button>
              ))}
            </div>
          )}

          {/* USER FEATURES */}
          {[
            { id: 'my-recipes', label: 'My Recipes', icon: <ChefHat size={20} /> },
            { id: 'favorites', label: 'Favorites', icon: <Heart size={20} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                toggleSidebar();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* 🔐 ADMIN SECTION */}
          {user?.isAdmin && (
            <>
              <div className="border-t border-stone-200 dark:border-stone-800 my-4" />

              <p className="px-4 text-xs font-semibold text-stone-400 uppercase">
                Admin
              </p>

              <button
                onClick={() => {
                  navigate('/admin/dashboard');
                  toggleSidebar();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
              >
                <Shield size={20} />
                Dashboard
              </button>

              <button
                onClick={() => {
                  navigate('/admin/recipes');
                  toggleSidebar();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <ChefHat size={20} />
                Manage Recipes
              </button>

              <button
                onClick={() => {
                  navigate('/admin/contact-messages');
                  toggleSidebar();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <Mail size={20} />
                Contact Messages
              </button>

              <button
                onClick={() => {
                  navigate('/admin/feedback');
                  toggleSidebar();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
              >
                <MessageSquare size={20} />
                User Feedback
              </button>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 dark:border-stone-800">
          <p className="text-xs italic text-stone-500">
            {dailyThought?.text || 'Cooking is an art, love is the ingredient.'}
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
