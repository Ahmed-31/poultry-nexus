// resources/js/src/services/customersService.jsx
import api from './axios';

// Get all orders
export const getCustomers = async () => {
    try {
        const response = await api.get('/api/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
