import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        console.log('ProtectedRoute - Auth Data:', {
            token,
            userRole,
            userId
        });
    }, [token, userRole, userId]);

    if (!token || !userRole || !userId) {
        console.log('Missing auth data:', { token, userRole, userId });
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log('Invalid role for route:', {
            userRole,
            allowedRoles
        });
        
        if (userRole === 'coordinator') {
            return <Navigate to="/coordinator" replace />;
        } else if (userRole === 'user') {
            return <Navigate to="/user" replace />;
        } else if (userRole === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
