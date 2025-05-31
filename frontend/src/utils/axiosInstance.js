import axios from 'axios';

const Axios = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	}
});

// Request interceptor to add auth token if available
Axios.interceptors.request.use(
	(config) => {
		// If you want to use Authorization header instead of cookies
		const token = localStorage.getItem('auth_token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor to handle errors globally
Axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		// Handle 401 errors globally
		if (error.response?.status === 401) {
			// Clear user data and redirect to login
			localStorage.removeItem('user');
			localStorage.removeItem('auth_token');
			// You can also redirect to login page here if needed
			// window.location.href = '/auth';
		}
		return Promise.reject(error);
	}
);

export { Axios };