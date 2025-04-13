import API from './axios.jsx';

export const getProductBundles = async () => {
    try {
        const response = await API.get('/api/stock/products/bundles');
        return response.data;
    } catch (error) {
        console.error('Error fetching product bundles:', error);
        throw error;
    }
}

export const getProductBundlesTable = async () => {
    try {
        const response = await API.get('/api/stock/products/bundles/all');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching product bundles:', error);
        throw error;
    }
}

export const createProductBundle = async (productBundleData) => {
    try {
        const response = await API.post('/api/stock/products/bundles', productBundleData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateProductBundle = async (id, productBundleData) => {
    try {
        const response = await API.put(`/api/stock/products/bundles/${id}`, productBundleData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteProductBundle = async (id) => {
    try {
        const response = await API.delete(`/api/stock/products/bundles/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
