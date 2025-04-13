import API from './axios.jsx';

export const getUoms = async () => {
    try {
        const response = await API.get('/api/settings/uoms');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getUomsTable = async () => {
    try {
        const response = await API.get('/api/settings/uoms/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const addUom = async (uomData) => {
    try {
        const response = await API.post('/api/settings/uoms', uomData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateUom = async (id, uomData) => {
    try {
        const response = await API.put(`/api/settings/uoms/${id}`, uomData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteUom = async (id) => {
    try {
        const response = await API.delete(`/api/settings/uoms/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
