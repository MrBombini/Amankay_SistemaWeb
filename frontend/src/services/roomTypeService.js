import api from './api';

const roomTypeService = {
  getAll: async () => {
    const response = await api.get('/room-types');
    return response.data.data || response.data;
  }
};

export default roomTypeService;
