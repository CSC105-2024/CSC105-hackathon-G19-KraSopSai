import { Navigate } from "react-router-dom";

// Helper function to get cookie value
const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

const ProtectedRoute = ({ children }) => {
    // Check for the auth_token cookie instead of localStorage
    const token = getCookie("auth_token");

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;