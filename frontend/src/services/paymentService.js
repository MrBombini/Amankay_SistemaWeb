import api from './api';

const paymentService = {
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data.data || response.data;
  }
};

export default paymentService;
