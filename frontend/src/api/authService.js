import { Axios } from '../utils/axiosInstance.js';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await Axios.post('/auth/login', credentials);

            // Store user data if login successful
            if (response.data.success && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Note: The auth_token cookie is set automatically by the server
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Login failed' };
        }
    },

    register: async (userData) => {
        try {
            const response = await Axios.post('/auth/register', userData);

            // Store user data if registration successful
            if (response.data.success && response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                // Note: The auth_token cookie is set automatically by the server
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Registration failed' };
        }
    },

    logout: async () => {
        try {
            const response = await Axios.post('/auth/logout');

            // Clear local storage regardless of server response
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('authToken'); // Clear both token variations

            return response.data;
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            // Even if server request fails, clear local data
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('authToken');

            // Don't throw error for logout - always succeed locally
            return { success: true, message: 'Logged out locally' };
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const response = await Axios.get('/auth/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to get profile' };
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const user = localStorage.getItem('user');
        return !!user;
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }
};