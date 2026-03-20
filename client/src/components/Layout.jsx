import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, Search, Share2, Settings, X } from 'lucide-react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import AuthContext from '../context/AuthContext';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dietaryFilter, setDietaryFilter] = useState('all');
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getActiveTab = () => {
        const path = location.pathname;
        if (path === '/') return 'discover';
        if (path === '/trending') return 'trending';
        if (path === '/food-news') return 'food-news';
        if (path === '/tv-shows') return 'tv-shows';
        if (path.startsWith('/cuisines')) return 'cuisines';
        if (path === '/my-recipes') return 'my-recipes';
        if (path === '/favorites') return 'favorites';
        if (path === '/add-recipe') return 'add-recipe';
        return '';
    };

    const handleTabChange = (id) => {
        if (id === 'discover') navigate('/');
        else if (id === 'cuisines') return;
        else navigate(`/${id}`);
    };

    const getTitle = () => {
        const tab = getActiveTab();
        if (tab === 'discover') return 'Discover';
        if (tab === 'trending') return 'Trending Recipes';
        if (tab === 'food-news') return 'Food News';
        if (tab === 'tv-shows') return 'TV Shows';
        if (tab === 'cuisines') return 'Cuisines';
        if (tab === 'my-recipes') return 'My Recipes';
        if (tab === 'favorites') return 'Favorites';
        if (tab === 'add-recipe') return 'Add Recipe';
        return 'CookBook';
    };

    return (
        <div className="flex h-screen bg-stone-100 dark:bg-stone-900 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300">

            <Sidebar
                activeTab={getActiveTab()}
                setActiveTab={handleTabChange}
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* HEADER */}
                <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 z-10 sticky top-0">

                    {/* Main header row */}
                    <div className="h-14 md:h-20 flex items-center justify-between px-3 md:px-8">

                        {/* LEFT */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                            >
                                <Menu size={22} />
                            </button>
                            <h1 className="text-base md:text-xl font-bold truncate max-w-[120px] md:max-w-none">
                                {getTitle()}
                            </h1>
                        </div>

                        {/* SEARCH — Desktop */}
                        <div className="flex-1 max-w-md mx-4 hidden md:block">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search for pasta, healthy snacks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-stone-100 dark:bg-stone-800 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-2 md:gap-3">

                            {/* Mobile Search Toggle */}
                            <button
                                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                                className="md:hidden p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                            >
                                {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
                            </button>

                            {/* DIETARY FILTER — Desktop */}
                            <div className="hidden md:flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1">
                                {['all', 'veg', 'non-veg'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setDietaryFilter(filter)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${
                                            dietaryFilter === filter
                                                ? 'bg-white dark:bg-stone-700 shadow-sm'
                                                : 'text-stone-500'
                                        }`}
                                    >
                                        {filter === 'veg' ? '🟢 Veg' : filter === 'non-veg' ? '🔴 Non-Veg' : 'All'}
                                    </button>
                                ))}
                            </div>

                            <ThemeToggle />

                            {/* AUTH */}
                            {user ? (
                                <div className="hidden md:flex items-center gap-3 pl-4 border-l border-stone-200 dark:border-stone-700">
                                    <div className="relative group">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 p-0.5 cursor-pointer">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-stone-800 flex items-center justify-center overflow-hidden">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'User'}`}
                                                    alt="User"
                                                    className="w-full h-full"
                                                />
                                            </div>
                                        </div>

                                        {/* DROPDOWN */}
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-xl shadow-lg py-1 hidden group-hover:block border border-stone-100 dark:border-stone-700 z-50">

                                            {/* 🔐 ADMIN ONLY */}
                                            {user?.isAdmin && (
                                                <button
                                                    onClick={() => navigate('/admin/dashboard')}
                                                    className="block w-full text-left px-4 py-2 text-sm text-orange-600 hover:bg-stone-50 dark:hover:bg-stone-700"
                                                >
                                                    🛡 Admin Panel
                                                </button>
                                            )}

                                            <button
                                                onClick={() => navigate('/change-password')}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2"
                                            >
                                                <Settings size={16} /> Change Password
                                            </button>

                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm hover:bg-stone-50 dark:hover:bg-stone-700 flex items-center gap-2"
                                            >
                                                <Share2 size={16} className="rotate-180" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-4 ml-4">
                                    <button onClick={() => navigate('/login')}>Log In</button>
                                    <button onClick={() => navigate('/register')}>Sign Up</button>
                                    <Link to="/contact-us">Contact Us</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile expandable row — search + filter */}
                    {mobileSearchOpen && (
                        <div className="md:hidden px-3 pb-3 space-y-2 animate-fade-in">
                            {/* Mobile Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search recipes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-full bg-stone-100 dark:bg-stone-800 focus:ring-2 focus:ring-orange-200 outline-none text-sm"
                                    autoFocus
                                />
                            </div>
                            {/* Mobile Dietary Filter */}
                            <div className="flex bg-stone-100 dark:bg-stone-800 rounded-lg p-1 w-fit">
                                {['all', 'veg', 'non-veg'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setDietaryFilter(filter)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${
                                            dietaryFilter === filter
                                                ? 'bg-white dark:bg-stone-700 shadow-sm'
                                                : 'text-stone-500'
                                        }`}
                                    >
                                        {filter === 'veg' ? '🟢 Veg' : filter === 'non-veg' ? '🔴 Non-Veg' : 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mobile bottom bar — auth buttons (only when NOT logged in and search is closed) */}
                    {!user && !mobileSearchOpen && (
                        <div className="md:hidden flex items-center justify-center gap-4 px-3 pb-2 text-sm">
                            <button onClick={() => navigate('/login')} className="text-orange-600 font-medium">Log In</button>
                            <button onClick={() => navigate('/register')} className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">Sign Up</button>
                            <Link to="/contact-us" className="text-stone-500">Contact Us</Link>
                        </div>
                    )}
                </header>

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950">
                    <Outlet context={{ searchQuery, setSearchQuery, dietaryFilter }} />
                </main>

            </div>
        </div>
    );
};

export default Layout;
