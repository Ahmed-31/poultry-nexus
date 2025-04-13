import API from './axios.jsx';

export const getWarehouses = async () => {
    try {
        const response = await API.get('/api/stock/warehouses');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getWarehousesTable = async () => {
    try {
        const response = await API.get('/api/stock/warehouses/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const createWarehouse = async (warehouseData) => {
    try {
        const response = await API.post('/api/stock/warehouses', warehouseData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateWarehouse = async (id, warehouseData) => {
    try {
        const response = await API.put(`/api/stock/warehouses/${id}`, warehouseData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteWarehouse = async (id) => {
    try {
        const response = await API.delete(`/api/stock/warehouses/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
