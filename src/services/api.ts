import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://dentify-backend-dct4.onrender.com', // exemplo, ajuste para sua API
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem('@dentify_token'); // certifique-se do nome correto
    if (token) {
      // Modifica diretamente o header Authorization sem sobrescrever os demais
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de erro para logout automático se o token for inválido
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@dentify_token');
      console.warn('Sessão expirada. Faça login novamente.');
    }
    return Promise.reject(error);
  }
);

export default api;
