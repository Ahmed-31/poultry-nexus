import API from './axios.jsx';

export const getWarehouses = async () => {
    try {
        const response = await API.get('api/inventory/warehouses');
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const addWarehouse = async (warehouseData) => {
    try {
        const response = await API.post('api/inventory/warehouses', warehouseData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const updateWarehouse = async (id, warehouseData) => {
    try {
        const response = await API.put(`api/inventory/warehouses/${id}`, warehouseData);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const deleteWarehouse = async (id) => {
    try {
        const response = await API.delete(`api/inventory/warehouses/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
