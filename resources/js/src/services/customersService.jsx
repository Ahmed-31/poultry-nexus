import api from './axios';

export const getCustomers = async () => {
    try {
        const response = await api.get('/api/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
