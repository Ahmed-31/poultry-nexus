import api from './axios.jsx';

export const getCsrfToken = () => api.get('/sanctum/csrf-cookie');

export const login = async (email, password) => {
    const response = await api.post('/api/login', {email, password});
    const {access_token} = response.data;

    localStorage.setItem('auth_token', access_token);

    return response;
};


export const logout = () => api.post('/api/logout');

export const fetchUser = () => api.get('/api/user');
