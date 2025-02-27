import API from './axios.jsx';

export const getProducts = async () => {
    try {
        const response = await API.get('api/inventory/products');
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await API.post('api/inventory/products', productData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await API.put(`api/inventory/products/${id}`, productData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await API.delete(`api/inventory/products/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
