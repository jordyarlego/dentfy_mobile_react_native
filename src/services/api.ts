// services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api: AxiosInstance = axios.create({
  baseURL: 'https://dentify-backend-dct4.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de erro para logout automático se o token for inválido
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // redirecionar para login (não temos `window.location.href` no React Native)
      // Exemplo: usar navegação ou emitir evento
      console.warn('Sessão expirada. Faça login novamente.');
    }
    return Promise.reject(error);
  }
);

export default api;
