import API from './axios.jsx';

export const getProductBundles = async () => {
    try {
        const response = await API.get('/api/inventory/products/bundles');
        return response.data;
    } catch (error) {
        console.error('Error fetching product bundles:', error);
        return [];
    }
}
