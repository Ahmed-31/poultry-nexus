import api from './axios';

export const getStock = async () => {
    try {
        const response = await api.get('/api/stock/items');
        return response.data;
    } catch (error) {
        console.error('Error fetching stock:', error);
        throw error;
    }
};

export const getStockTable = async () => {
    try {
        const response = await api.get('/api/stock/items/all');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching stock:', error);
        throw error;
    }
};

export const addStock = async (data) => {
    try {
        const response = await api.post('/api/stock/items', data);
        return response.data;
    } catch (error) {
        console.error('Error adding stock:', error);
        throw error;
    }
};

export const updateStock = async (id, data) => {
    try {
        const response = await api.put(`/api/stock/items/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating stock:', error);
        throw error;
    }
};

export const deleteStock = async (id) => {
    try {
        await api.delete(`/api/stock/items/${id}`);
    } catch (error) {
        console.error('Error deleting stock:', error);
        throw error;
    }
};

export const issueStock = async (id, payload) => {
    try {
        const response = await api.post(`/api/stock/items/${id}/issue`, payload);
        return response.data;
    } catch (error) {
        console.error("Error issuing stock:", error);
        throw error;
    }
};

export const transferStock = async (id, payload) => {
    try {
        const response = await api.post(`/api/stock/items/${id}/transfer`, payload);
        return response.data;
    } catch (error) {
        console.error("Error transferring stock:", error);
        throw error;
    }
};

export const adjustStock = async (id, payload) => {
    try {
        const response = await api.post(`/api/stock/items/${id}/adjust`, payload);
        return response.data;
    } catch (error) {
        console.error("Error adjusting stock:", error);
        throw error;
    }
};

export const fetchMatchingStocks = async (productId, warehouseId) => {
    try {
        const res = await api.get(`/api/stock/items/fetch`, {
            params: {product_id: productId, warehouse_id: warehouseId},
        });
        return res.data;
    } catch (error) {
        console.error("Error issuing stock:", error);
        throw error;
    }
};

export const getStockItem = async (id) => {
    try {
        const response = await api.get(`/api/stock/items/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stock item:', error);
        throw error;
    }
};
