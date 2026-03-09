import React, { useContext } from 'react';
import {
  Shield,
  ChefHat,
  LogOut,
  ArrowLeft,
  Users,
  Lightbulb,
  LayoutDashboard,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import AuthContext from '../context/AuthContext';

const Admin = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const tabs = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/recipes', label: 'Recipes', icon: ChefHat },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/contact', label: 'Contact Messages', icon: Mail },        // ✅ ADDED
    { path: '/admin/feedback', label: 'User Feedback', icon: MessageSquare }, // ✅ ADDED
    { path: '/admin/thoughts', label: 'Inspirations', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
                <Shield size={24} className="text-orange-600 dark:text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">
                  Admin Panel
                </h1>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Manage your cookbook
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                {user?.username || 'Admin'}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-6 py-4 font-medium text-sm relative transition-all ${
                  isActive
                    ? 'text-orange-600 dark:text-orange-500'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <tab.icon size={18} />
                  {tab.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Admin;
