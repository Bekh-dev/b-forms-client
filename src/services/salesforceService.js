import api from './api';

const salesforceService = {
  // Проверка подключения к Salesforce
  testConnection: async () => {
    try {
      const response = await api.get('/salesforce/test-connection');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Синхронизация данных пользователя с Salesforce
  syncUserData: async (userData) => {
    try {
      const response = await api.post('/salesforce/sync', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Получение статуса синхронизации
  getSyncStatus: async () => {
    try {
      const response = await api.get('/salesforce/sync-status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default salesforceService;
