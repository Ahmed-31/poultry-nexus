// resources/js/src/services/orderService.js
import api from './axios';

// Get all orders
export const getOrders = async () => {
    try {
        const response = await api.get('/api/orders');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

// Add a new order
export const addOrder = async (orderData) => {
    try {
        const response = await api.post('/api/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error adding order:', error);
        throw error;
    }
};

// Update an existing order
export const updateOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/api/orders/${id}`, orderData);
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

// Delete an order
export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/api/orders/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting order:', error);
        throw error;
    }
};
