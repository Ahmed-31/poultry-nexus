// resources/js/src/services/customersService.jsx
import axios from 'axios';

// Get all orders
export const getCustomers = async () => {
    try {
        const response = await axios.get('/api/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};
