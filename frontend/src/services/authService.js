import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    },

    getProfile: async (token) => {
        const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    }
};

export default authService;