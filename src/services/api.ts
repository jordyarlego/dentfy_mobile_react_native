import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://dentify-backend-dct4.onrender.com',
  timeout: 300000, // Aumentado para 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor para adicionar o token nas requisições
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      console.log('=== INTERCEPTOR DE REQUISIÇÃO ===');
      console.log('URL:', config.url);
      console.log('Método:', config.method);
      
      const token = await AsyncStorage.getItem('token');
      console.log('Token no AsyncStorage:', token ? 'Token presente' : 'Token ausente');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token adicionado ao header:', config.headers.Authorization);
      } else {
        console.log('Nenhum token encontrado para adicionar ao header');
      }
      
      console.log('Headers finais:', config.headers);
      console.log('=== FIM DO INTERCEPTOR DE REQUISIÇÃO ===');
      
      return config;
    } catch (error) {
      console.error('Erro no interceptor de requisição:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Erro no interceptor de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor de erro para logout automático se o token for inválido
api.interceptors.response.use(
  (response) => {
    console.log('=== INTERCEPTOR DE RESPOSTA ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Headers:', response.headers);
    console.log('=== FIM DO INTERCEPTOR DE RESPOSTA ===');
    return response;
  },
  async (error: AxiosError) => {
    console.error('=== ERRO NO INTERCEPTOR DE RESPOSTA ===');
    console.error('URL:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    console.error('Data:', error.response?.data);
    
    // Tratamento específico para erros de rede
    if (error.message === 'Network Error') {
      error.message = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.';
    }
    
    console.error('Detalhes do erro:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    if (error.response?.status === 401) {
      console.log('Token inválido, removendo token e redirecionando para login');
      await AsyncStorage.removeItem('token');
      console.warn('Sessão expirada. Faça login novamente.');
    }
    
    console.error('=== FIM DO ERRO NO INTERCEPTOR DE RESPOSTA ===');
    return Promise.reject(error);
  }
);

export default api;
