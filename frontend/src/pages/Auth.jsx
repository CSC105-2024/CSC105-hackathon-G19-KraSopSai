import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import { EyeOff, Eye } from 'lucide-react';
import { Axios } from '../utils/axiosInstance.js'

export default function AuthPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear messages when user starts typing
        if (error) setError("");
        if (success) setSuccess("");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            if (isLogin) {

                if (!formData.email || !formData.password) {
                    throw new Error("Please fill in all required fields");
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw new Error("Please provide a valid email address");
                }

                const response = await Axios.post('/auth/login', {
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    setSuccess("Login successful! Welcome back.");

                    // Only store user data in localStorage, token is handled by cookies
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    setFormData({username: "", email: "", password: ""});

                    setTimeout(() => {
                        navigate("/userDetail");
                    }, 1000);
                } else {
                    throw new Error(response.data.message || "Login failed");
                }

            } else {
                // Register
                if (!formData.username || !formData.email || !formData.password) {
                    throw new Error("Please fill in all required fields");
                }

                if (formData.username.trim().length < 3) {
                    throw new Error("Username must be at least 3 characters long");
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw new Error("Please provide a valid email address");
                }

                if (formData.password.length < 6) {
                    throw new Error("Password must be at least 6 characters long");
                }

                const response = await Axios.post('/auth/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                });

                if (response.data.success) {
                    setSuccess("Registration successful! Redirecting to your profile...");

                    // Only store user data in localStorage, token is handled by cookies
                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    setFormData({username: "", email: "", password: ""});

                    setTimeout(() => {
                        navigate("/userDetail");
                    }, 1000);
                } else {
                    throw new Error(response.data.message || "Registration failed");
                }
            }
        } catch (err) {
            console.error("Auth error:", err);

            // Handle different types of errors
            if (err.response) {
                // Server responded with error status
                const errorMessage = err.response.data.message || err.response.data.error || "Operation failed";
                setError(errorMessage);
            } else if (err.request) {
                // Request was made but no response
                setError("Network error. Please check your connection and make sure the server is running.");
            } else {
                // Something else happened
                setError(err.message || "Operation failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle logout (you might want this in a separate component)
    const handleLogout = async () => {
        try {
            await Axios.post('/auth/logout');
            localStorage.removeItem('user');
            navigate('/auth');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if logout fails on server, clear local data
            localStorage.removeItem('user');
            navigate('/auth');
        }
    };

    return (
        <div className="bg-[url('/images/background.jpg')] bg-cover bg-center h-screen min-h-screen relative overflow-hidden">
            {/* Auth Form Container */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-sm">

                    {/* Login/Register Toggle */}
                    <div className="flex mb-8 text-sm font-semibold">
                        <button
                            className={`flex-1 py-2 text-center transition-all duration-200 ${
                                isLogin
                                    ? 'text-pink-500 border-b-4 border-pink-500'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            onClick={() => {
                                setIsLogin(true);
                                setError("");
                                setSuccess("");
                                setFormData({username: "", email: "", password: ""});
                            }}
                            disabled={isLoading}
                        >
                            LOG IN
                        </button>
                        <button
                            className={`flex-1 py-2 text-center transition-all duration-200 ${
                                !isLogin
                                    ? 'text-pink-500 border-b-4 border-pink-500'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            onClick={() => {
                                setIsLogin(false);
                                setError("");
                                setSuccess("");
                                setFormData({username: "", email: "", password: ""});
                            }}
                            disabled={isLoading}
                        >
                            REGISTER
                        </button>
                    </div>

                    {/* Form Title */}
                    <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                        {isLogin ? 'WELCOME BACK' : 'Create a New Account'}
                    </h1>

                    {/* Success/Error Messages */}
                    {error && (
                        <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form Fields */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username (min 3 characters)"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    disabled={isLoading}
                                    required={!isLogin}
                                    minLength={3}
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email address"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={isLoading}
                                required
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder={isLogin ? "Password" : "Password (min 6 characters)"}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={isLoading}
                                required
                                minLength={isLogin ? undefined : 6}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-custom-mediumgradient hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading
                                ? (isLogin ? "LOGGING IN..." : "REGISTERING...")
                                : (isLogin ? "LOGIN" : "REGISTER")
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}