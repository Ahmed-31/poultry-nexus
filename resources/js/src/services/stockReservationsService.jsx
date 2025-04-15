import API from './axios.jsx';

export const getStockReservations = async (params = {}) => {
    try {
        const response = await API.get('/api/stock/reservations', {
            params
        });
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getStockReservation = async (id) => {
    try {
        const response = await API.get(`/api/stock/reservations/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getStockReservationsTable = async (params = {}) => {
    try {
        const response = await API.get('/api/stock/reservations/all', {
            params,
        });
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
