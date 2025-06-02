// services/authService.ts
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (cpf: string, senha: string) => {
  const response = await api.post('api/users/login', { cpf, senha });

  const { token, user } = response.data;
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user)); // útil para guardar o perfil/role

  return response.data;
};
