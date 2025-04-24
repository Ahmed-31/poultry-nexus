import API from './axios.jsx';

export const getUomDimensions = async () => {
    try {
        const response = await API.get('/api/settings/uom/dimensions');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getUomDimensionsTable = async () => {
    try {
        const response = await API.get('/api/settings/uom/dimensions/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const addUomDimension = async (uomDimensionData) => {
    try {
        const response = await API.post('/api/settings/uom/dimensions', uomDimensionData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateUomDimension = async (id, uomDimensionData) => {
    try {
        const response = await API.put(`/api/settings/uom/dimensions/${id}`, uomDimensionData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteUomDimension = async (id) => {
    try {
        const response = await API.delete(`/api/settings/uom/dimensions/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
