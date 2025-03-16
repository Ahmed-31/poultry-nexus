import API from './axios.jsx';

export const getStockMovements = async () => {
    try {
        const response = await API.get('/api/inventory/stock-movements');
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const createStockMovement = async (movementData) => {
    try {
        const response = await API.post('/api/inventory/stock-movements', movementData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
