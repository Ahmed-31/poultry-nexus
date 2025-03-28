// resources/js/src/services/usersService.js
import api from './axios';

// Helper to sanitize user data and add password confirmation
const buildUserPayload = (userData, confirmPassword = '') => {
    const { name, email, password } = userData;
    const payload = { name, email };

    if (password) {
        payload.password = password;
        payload.password_confirmation = confirmPassword;
    }

    return payload;
};

// Get all users
export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUsersTable = async () => {
    try {
        const response = await api.get('/api/users/all');
        return response.data.data;
    } catch (e) {
        console.error('Error fetching users table:', e);
        return [];
    }
};

export const getUser = async (id) => {
    try {
        const response = await api.get(`/api/users/${id}`);
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
};

// Add a new user
export const createUser = async (userData) => {
    try {
        const response = await api.post('/api/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error adding user:', error.response?.data || error);
        throw error;
    }
};

// Update an existing user by ID
export const updateUser = async (id, userData, confirmPassword = '') => {
    try {
        const payload = buildUserPayload(userData, confirmPassword);
        const response = await api.put(`/api/users/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error.response?.data || error);
        throw error;
    }
};

// Update the currently logged-in user (no ID needed)
export const updateCurrentUser = async (userData, confirmPassword = '') => {
    try {
        const payload = buildUserPayload(userData, confirmPassword);
        const response = await api.put('/api/user', payload);
        return response.data;
    } catch (error) {
        console.error('Error updating current user:', error.response?.data || error);
        throw error;
    }
};

// Delete a user
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
// Get available permissions
export const getAvailablePermissions = async () => {
    try {
        const response = await api.get('/api/permissions');
        return response.data; // Assuming response.data is an array like ['create', 'edit', 'delete']
    } catch (error) {
        console.error('Error fetching permissions:', error);
        throw error;
    }
};
