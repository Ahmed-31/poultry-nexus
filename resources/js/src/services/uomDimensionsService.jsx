import API from './axios.jsx';

export const getUomDimensions = async () => {
    try {
        const response = await API.get('/api/settings/uomDimensions');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getUomDimensionsTable = async () => {
    try {
        const response = await API.get('/api/settings/uomDimensions/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const addUomDimension = async (uomDimensionData) => {
    try {
        const response = await API.post('/api/settings/uomDimensions', uomDimensionData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateUomDimension = async (id, uomDimensionData) => {
    try {
        const response = await API.put(`/api/settings/uomDimensions/${id}`, uomDimensionData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteUomDimension = async (id) => {
    try {
        const response = await API.delete(`/api/settings/uomDimensions/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
