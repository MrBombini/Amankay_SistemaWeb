import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const roomService = {
    // Obtener todas las habitaciones
    getAllRooms: async (token) => {
        const response = await axios.get(`${API_URL}/rooms`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Obtener habitaciones disponibles
    getAvailableRooms: async (token, checkIn, checkOut) => {
        const response = await axios.get(`${API_URL}/rooms/available`, {
            params: { checkIn, checkOut },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Crear habitación (admin)
    createRoom: async (token, roomData) => {
        const response = await axios.post(`${API_URL}/rooms`, roomData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Actualizar habitación (admin)
    updateRoom: async (token, roomId, roomData) => {
        const response = await axios.put(`${API_URL}/rooms/${roomId}`, roomData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    // Eliminar habitación (admin)
    deleteRoom: async (token, roomId) => {
        const response = await axios.delete(`${API_URL}/rooms/${roomId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
};

export default roomService;