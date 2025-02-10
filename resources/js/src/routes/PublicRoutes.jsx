// resources/js/src/routes/PublicRoute.jsx
import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext.jsx';

const PublicRoute = ({children}) => {
    const {user, loading} = useAuth();

    if (loading) {
        // You can show a loader while checking auth status
        return <div>Loading...</div>;
    }

    // If user is authenticated, redirect to home
    if (user) {
        return <Navigate to="/" replace/>;
    }

    // If not authenticated, allow access to the login page
    return children;
};

export default PublicRoute;
