import {useNavigate} from 'react-router-dom';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {getCsrfToken, fetchUser, login as apiLogin, logout as apiLogout} from '../services/authService.jsx';
import useIdleTimeout from "../hooks/useIdleTimeout.jsx";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch user when the app loads (if already authenticated)
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            fetchUser()
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('auth_token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Login function
    const login = async (email, password) => {
        await getCsrfToken();
        await apiLogin(email, password);
        const {data} = await fetchUser();
        setUser(data);
        localStorage.setItem("auth_start_time", Date.now());
    };

    // Logout function
    const logout = async () => {
        await apiLogout();
        localStorage.removeItem('auth_token');
        localStorage.removeItem("auth_start_time");
        setUser(null);
        navigate('/login');
    };

    // Use the idle timeout hook
    useIdleTimeout(logout, 8 * 60 * 60 * 1000); // Logout after 8 hours of inactivity

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};
