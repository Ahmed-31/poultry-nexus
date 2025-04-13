import API from './axios.jsx';

export const getCategories = async () => {
    try {
        const response = await API.get('/api/stock/categories');
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const getCategoriesTable = async () => {
    try {
        const response = await API.get('/api/stock/categories/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await API.post('/api/stock/categories', categoryData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await API.put(`/api/stock/categories/${id}`, categoryData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await API.delete(`/api/stock/categories/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
