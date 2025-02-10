import {useNavigate} from 'react-router-dom';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {getCsrfToken, fetchUser, login as apiLogin, logout as apiLogout} from '../services/authService.jsx';

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
    };

    // Logout function
    const logout = async () => {
        await apiLogout();
        localStorage.removeItem('auth_token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{user, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
};
