// resources/js/src/services/usersService.js
import api from './axios';

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
        console.error(e);
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
        console.error('Error adding user:', error);
        throw error;
    }
};

// Update an existing user
export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/api/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

// Delete an user
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
