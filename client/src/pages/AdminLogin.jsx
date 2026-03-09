import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Shield, Lock } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login({ email, password });
            if (user.isAdmin) {
                navigate('/admin/dashboard');
            } else {
                setError('Access denied. Admin privileges required.');
            }
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900 px-4 font-sans">
            <div className="bg-stone-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-stone-700">
                <div className="flex flex-col items-center justify-center gap-4 mb-8">
                    <div className="p-4 bg-orange-900/30 rounded-2xl">
                        <Shield size={40} className="text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-stone-100">Admin Portal</h2>
                </div>
                
                {error && (
                    <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-stone-400 mb-1.5">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-4 py-3 rounded-xl border border-stone-700 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder-stone-600"
                                placeholder="admin@cookbook.com"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-400 mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-700 bg-stone-900/50 text-stone-100 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all placeholder-stone-600"
                                placeholder="••••••••"
                                required
                            />
                            <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-600" />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-3.5 rounded-xl hover:from-orange-500 hover:to-red-500 transition-all shadow-lg shadow-orange-900/20"
                    >
                        Access Dashboard
                    </button>
                </form>
                
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/')}
                        className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
                    >
                        Return to Main Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
