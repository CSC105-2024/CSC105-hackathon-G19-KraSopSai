import { Navigate } from "react-router-dom";

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const cookieValue = parts.pop().split(';').shift();
        return cookieValue || null; // Return null if empty string
    }
    return null;
};

// Optional: Add token validation function
const isValidToken = (token) => {
    if (!token || token.trim() === '') return false;
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        return true;
    } catch (error) {
        return false;
    }
};

const ProtectedRoute = ({ children }) => {
    const token = getCookie("auth_token");

    // Enhanced validation
    if (!token || !isValidToken(token)) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;