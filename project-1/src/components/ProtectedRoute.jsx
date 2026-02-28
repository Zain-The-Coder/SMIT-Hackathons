import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
    const { user, role, loading } = useAuth();

    // 1. Agar Firebase abhi check kar raha hai (Initial Load)
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // 2. Agar user logged in hi nahi hai
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 3. Agar user logged in hai lekin uska Role match nahi karta
    // Hum comparison ke liye lowercase use kar rahe hain safety ke liye
    if (allowedRole && role?.toLowerCase() !== allowedRole.toLowerCase()) {
        return <Navigate to="/login" replace />;
    }

    // 4. Agar sab sahi hai, to Page (children) dikhao
    return children;
};

export default ProtectedRoute;