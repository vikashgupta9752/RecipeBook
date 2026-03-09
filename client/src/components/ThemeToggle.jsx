import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import ThemeContext from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
};

export default ThemeToggle;
