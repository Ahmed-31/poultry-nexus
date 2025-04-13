import api from './axios';
import API from "@/src/services/axios.jsx";

export const getCustomers = async () => {
    try {
        const response = await api.get('/api/customers');
        return response.data;
    } catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
};

export const getCustomersTable = async () => {
    try {
        const response = await API.get('/api/customers/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getCustomer = async (id) => {
    try {
        const response = await api.get(`/api/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer:', error);
        throw error;
    }
};

export const addCustomer = async (customerData) => {
    try {
        const response = await api.post('/api/customers', customerData);
        return response.data;
    } catch (error) {
        console.error('Error adding customer:', error);
        throw error;
    }
};

export const updateCustomer = async (id, customerData) => {
    try {
        const response = await api.put(`/api/customers/${id}`, customerData);
        return response.data;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    }
};

export const deleteCustomer = async (id) => {
    try {
        const response = await api.delete(`/api/customers/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    }
};
