import axios from 'axios';

const Axios = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true, // This is important for cookies
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 second timeout
});

// Request interceptor
Axios.interceptors.request.use(
	(config) => {
		// Since you're using cookies, you don't need the Authorization header
		// But keep this if you want to support both methods
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Response interceptor with better error handling
Axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.error('Response error:', error);

		// Handle different error scenarios
		if (error.response) {
			// Server responded with error status
			const status = error.response.status;

			if (status === 401) {
				// Clear user data and redirect to login
				localStorage.removeItem('user');
				localStorage.removeItem('auth_token');

				// Only redirect if not already on auth page
				if (!window.location.pathname.includes('/auth')) {
					window.location.href = '/auth';
				}
			} else if (status === 403) {
				console.error('Access forbidden');
			} else if (status >= 500) {
				console.error('Server error');
			}
		} else if (error.request) {
			// Request was made but no response received
			console.error('Network error - no response received');
		} else {
			// Something else happened
			console.error('Error setting up request:', error.message);
		}

		return Promise.reject(error);
	}
);

export { Axios };