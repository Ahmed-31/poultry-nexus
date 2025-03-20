import API from './axios.jsx';

export const getCategories = async () => {
    try {
        const response = await API.get('/api/inventory/categories');
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getCategoriesTable = async () => {
    try {
        const response = await API.get('/api/inventory/categories/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await API.post('/api/inventory/categories', categoryData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await API.put(`/api/inventory/categories/${id}`, categoryData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await API.delete(`/api/inventory/categories/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
