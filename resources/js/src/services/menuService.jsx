import api from './axios';


export const fetchMenus = async () => {
    try {
        const response = await api.get(`/api/menus`);
        return response.data;
    } catch (error) {
        console.error("Error fetching menus:", error);
        return [];
    }
};
