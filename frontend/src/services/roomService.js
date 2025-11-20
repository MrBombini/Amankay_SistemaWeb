import api from './api';

const roomService = {
    // Obtener todas las habitaciones
    getAllRooms: async () => {
        const response = await api.get('/rooms');
        // backend returns { status, data: { rooms } }
        return response.data.data || response.data;
    },

    // Obtener habitaciones disponibles
    getAvailableRooms: async (checkIn, checkOut) => {
        const response = await api.get('/rooms/available', { params: { checkIn, checkOut } });
        return response.data.data || response.data;
    },

    // Crear habitación (admin)
    createRoom: async (roomData) => {
        const response = await api.post('/rooms', roomData);
        return response.data.data || response.data;
    },

    // Actualizar habitación (admin)
    updateRoom: async (roomId, roomData) => {
        const response = await api.put(`/rooms/${roomId}`, roomData);
        return response.data.data || response.data;
    },

    // Eliminar habitación (admin)
    deleteRoom: async (roomId) => {
        const response = await api.delete(`/rooms/${roomId}`);
        return response.data.data || response.data;
    }
};

export default roomService;