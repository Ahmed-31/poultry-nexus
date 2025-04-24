import API from './axios.jsx';

export const getUomGroups = async () => {
    try {
        const response = await API.get('/api/settings/uom/groups');
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const getUomGroupsTable = async () => {
    try {
        const response = await API.get('/api/settings/uom/groups/all');
        return response.data.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const addUomGroup = async (uomData) => {
    try {
        const response = await API.post('/api/settings/uom/groups', uomData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const updateUomGroup = async (id, uomData) => {
    try {
        const response = await API.put(`/api/settings/uom/groups/${id}`, uomData);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};

export const deleteUomGroup = async (id) => {
    try {
        const response = await API.delete(`/api/settings/uom/groups/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
        throw e;
    }
};
