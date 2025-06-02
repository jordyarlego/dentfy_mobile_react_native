import api from './api';
import { CasoData } from '../app/(app)/casos';
import { CasoCreateData } from '../app/(app)/casos';

// Buscar todos os casos
export async function buscarCasos(token?: string) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : undefined;

  const response = await api.get('/api/cases', config);
  return response.data.casos;
}

// Buscar caso por ID
export async function buscarCasoPorId(id: string, token?: string) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : undefined;

  const response = await api.get(`/api/cases/${id}`, config);
  return response.data.caso;
}

// Criar novo caso
export async function criarCaso(data: CasoCreateData, token: string) {
  const response = await api.post('/api/cases', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.caso;
}


// Atualizar caso
export async function atualizarCaso(id: string, data: Partial<CasoData>, token: string) {
  const response = await api.put(`/api/cases/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.caso;
}

// Deletar caso
export async function deletarCaso(id: string, token: string) {
  const response = await api.delete(`/api/cases/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.message;
}
