import API from './axios.jsx';

export const getStockMovements = async () => {
    try {
        const response = await API.get('/api/stock/stock-movements');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getStockMovementsTable = async () => {
    try {
        const response = await API.get('/api/stock/stock-movements/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const createStockMovement = async (movementData) => {
    try {
        const response = await API.post('/api/stock/stock-movements', movementData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
