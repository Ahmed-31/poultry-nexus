import api from './axios';

export const getOrders = async () => {
    try {
        const response = await api.get('/api/orders');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
export const getOrder = async (id) => {
    try {
        const response = await api.get(`/api/orders/${id}`);
        console.log("API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
};

export const addOrder = async (orderData) => {
    try {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error adding order:', error);
        throw error;
    }
};

export const updateOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/api/orders/${id}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/api/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};
