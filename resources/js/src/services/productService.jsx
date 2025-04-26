import API from './axios.jsx';

export const getProducts = async () => {
    try {
        const response = await API.get('/api/stock/products');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getProductsTable = async () => {
    try {
        const response = await API.get('/api/stock/products/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await API.post('/api/stock/products', productData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await API.put(`/api/stock/products/${id}`, productData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`/api/stock/products/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const importProducts = async (formData) => {
    try {
        return await API.post('/api/stock/products/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (e) {
        console.error(e);
        throw e;
    }
};
