import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import { EyeOff,Eye } from 'lucide-react';

export default function AuthPage() {
    const navigate = useNavigate(); // Add navigation hook
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    // Form data
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
                // Login Logic
                if (!formData.email || !formData.password) {
                    throw {error: "Please fill in all required fields"};
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw {error: "Please provide a valid email address"};
                }

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                setSuccess("Login successful! Welcome back.");

                // Reset form
                setFormData({username: "", email: "", password: ""});

                // Navigate to user details page after successful login
                setTimeout(() => {
                    navigate("/userDetail");
                }, 1000); // Small delay to show success message

            } else {
                // Registration Logic
                if (!formData.username || !formData.email || !formData.password) {
                    throw {error: "Please fill in all required fields"};
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw {error: "Please provide a valid email address"};
                }

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                setSuccess("Registration successful! Redirecting to your profile...");

                // Reset form
                setFormData({username: "", email: "", password: ""});

                // Navigate to user details page after successful registration
                setTimeout(() => {
                    navigate("/userDetail");
                }, 1000); // Small delay to show success message
            }
        } catch (err) {
            console.error("Auth error:", err);
            setError(err.error || err.message || "Operation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-green-200">
                {/* Sky with clouds */}
                <div className="absolute inset-0">
                    {/* Animated clouds */}
                    <div
                        className="absolute top-16 left-8 w-24 h-12 bg-white rounded-full opacity-70 animate-pulse"></div>
                    <div
                        className="absolute top-24 right-16 w-32 h-16 bg-white rounded-full opacity-80 animate-pulse delay-300"></div>
                    <div
                        className="absolute top-32 left-1/4 w-20 h-10 bg-white rounded-full opacity-60 animate-pulse delay-500"></div>
                    <div
                        className="absolute top-20 right-1/3 w-28 h-14 bg-white rounded-full opacity-75 animate-pulse delay-700"></div>
                    <div
                        className="absolute top-40 right-8 w-16 h-8 bg-white rounded-full opacity-65 animate-pulse delay-1000"></div>
                </div>

                {/* Animated Sun */}
                <div className="absolute top-18 right-20 w-16 h-16 bg-yellow-300 rounded-full shadow-lg animate-bounce">
                    {/* Sun rays */}
                    <div
                        className="absolute -top-6 left-1/2 w-0.5 h-4 bg-yellow-400 rounded transform -translate-x-1/2"></div>
                    <div
                        className="absolute -bottom-6 left-1/2 w-0.5 h-4 bg-yellow-400 rounded transform -translate-x-1/2"></div>
                    <div
                        className="absolute -left-6 top-1/2 w-4 h-0.5 bg-yellow-400 rounded transform -translate-y-1/2"></div>
                    <div
                        className="absolute -right-6 top-1/2 w-4 h-0.5 bg-yellow-400 rounded transform -translate-y-1/2"></div>
                    <div className="absolute -top-4 -left-4 w-3 h-0.5 bg-yellow-400 rounded transform rotate-45"></div>
                    <div
                        className="absolute -top-4 -right-4 w-3 h-0.5 bg-yellow-400 rounded transform -rotate-45"></div>
                    <div
                        className="absolute -bottom-4 -left-4 w-3 h-0.5 bg-yellow-400 rounded transform -rotate-45"></div>
                    <div
                        className="absolute -bottom-4 -right-4 w-3 h-0.5 bg-yellow-400 rounded transform rotate-45"></div>
                </div>

                {/* Flying birds */}
                <div className="absolute top-1/4 left-1/5 text-lg text-gray-700 animate-bounce">
                    <span className="inline-block transform rotate-12">⌄</span>
                    <span className="inline-block transform -rotate-12 ml-1">⌄</span>
                </div>
                <div className="absolute top-1/3 right-1/4 text-sm text-gray-600 animate-bounce delay-300">
                    <span className="inline-block transform rotate-12">⌄</span>
                    <span className="inline-block transform -rotate-12 ml-1">⌄</span>
                </div>
            </div>

            {/* Auth Form Container */}
            <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-sm">

                    {/* Login/Register Toggle */}
                    <div className="flex mb-8 text-sm font-medium">
                        <button
                            className={`flex-1 py-2 text-center transition-all duration-200 ${
                                isLogin
                                    ? 'text-pink-500 border-b-2 border-pink-500'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            onClick={() => setIsLogin(true)}
                            disabled={isLoading}
                        >
                            LOG IN
                        </button>
                        <button
                            className={`flex-1 py-2 text-center transition-all duration-200 ${
                                !isLogin
                                    ? 'text-pink-500 border-b-2 border-pink-500'
                                    : 'text-gray-400 hover:text-gray-600'
                            }`}
                            onClick={() => setIsLogin(false)}
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
                        <div
                            className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="w-full mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {!isLogin && (
                            <div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <Eye />
                                ) : (
                                    <EyeOff />
                                )}
                            </button>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading
                                ? (isLogin ? "LOGGING IN..." : "REGISTERING...")
                                : (isLogin ? "LOGIN" : "REGISTER")
                            }
                        </button>
                    </div>
                </div>
            </div>

        </div>

    );
}