import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ChefHat, Eye, EyeOff } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // ✅ NEW
    const [error, setError] = useState('');

    const { login, user, loading } = useContext(AuthContext); // ✅ loading + user
    const navigate = useNavigate();

    // ✅ REDIRECT IF ALREADY LOGGED IN
    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login({ email, password });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    };

    // ✅ GOOGLE LOGIN
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/api/auth/google';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 dark:bg-stone-950 px-4 transition-colors duration-300">
            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-lg w-full max-w-md transition-colors duration-300">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 text-orange-600 font-bold text-2xl mb-8">
                    <ChefHat size={32} />
                    <span>CookBook</span>
                </div>

                <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-100 mb-6 text-center">
                    Welcome Back
                </h2>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border"
                            required
                        />
                    </div>

                    {/* Password with show/hide */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 pr-12 rounded-xl border"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600"
                    >
                        Login
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-sm text-gray-500">OR</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 border py-3 rounded-xl"
                    >
                        <FcGoogle size={22} />
                        Continue with Google
                    </button>
                </form>

                <p className="mt-4 text-center text-stone-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-orange-600 font-bold hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;
