import axios from 'axios';

const api = axios.create({
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const authToken = localStorage.getItem('auth_token');

            if (authToken) {
                localStorage.removeItem('auth_token');
                window.location.replace('/login');
            }
        }
        return Promise.reject(error);
    }
);


export default api;
