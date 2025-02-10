// resources/js/src/services/inventoryService.js
import axios from 'axios';

export const getInventory = async () => {
    try {
        const response = await axios.get('/api/inventory');
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return [];
    }
};

export const addInventory = async (data) => {
    try {
        const response = await axios.post('/api/inventory', data);
        return response.data;
    } catch (error) {
        console.error('Error adding inventory:', error);
        throw error;
    }
};

export const updateInventory = async (id, data) => {
    try {
        const response = await axios.put(`/api/inventory/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating inventory:', error);
        throw error;
    }
};

export const deleteInventory = async (id) => {
    try {
        await axios.delete(`/api/inventory/${id}`);
    } catch (error) {
        console.error('Error deleting inventory:', error);
        throw error;
    }
};

export const getInventoryItem = async (id) => {
    try {
        const response = await axios.get(`/api/inventory/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        return null;
    }
};

export const getProducts = async () => {
    try {
        const response = await axios.get('/api/products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

export const getProductBundles = async () => {
    try {
        const response = await axios.get('/api/products/bundles');
        return response.data;
    } catch (error) {
        console.error('Error fetching product bundles:', error);
        return [];
    }
}

export const getWarehouses = async () => {
    try {
        const response = await axios.get('/api/warehouses');
        return response.data;
    } catch (error) {
        console.error('Error fetching warehouses:', error);
        return [];
    }
};
