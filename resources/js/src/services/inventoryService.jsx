// resources/js/src/services/inventoryService.js
import api from './axios';

export const getInventory = async () => {
    try {
        const response = await api.get('/api/inventory/items');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }
};

export const addInventory = async (data) => {
    try {
        const response = await api.post('/api/inventory/items', data);
        return response.data;
    } catch (error) {
        console.error('Error adding inventory:', error);
        throw error;
    }
};

export const updateInventory = async (id, data) => {
    try {
        const response = await api.put(`/api/inventory/items/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
};

export const deleteInventory = async (id) => {
    try {
        await api.delete(`/api/inventory/items/${id}`);
    } catch (error) {
        console.error('Error deleting inventory:', error);
        throw error;
    }
};

export const getInventoryItem = async (id) => {
    try {
        const response = await api.get(`/api/inventory/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        return null;
    }
};
