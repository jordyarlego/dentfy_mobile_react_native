import api from './api';
import type { CasoData, CasoStatusAPI } from '../components/CaseCard';

// Tipo para criar caso
export type CasoCreateData = Omit<CasoData, '_id' | 'dataFechamento'> & {
  dataFechamento?: string;
};

// Buscar todos os casos
export async function buscarCasos(token?: string) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : undefined;

  const response = await api.get('/api/cases', config);
  return response.data.casos as CasoData[];
}

// Buscar caso por ID
export async function buscarCasoPorId(id: string, token?: string) {
  const config = token ? {
    headers: { Authorization: `Bearer ${token}` }
  } : undefined;

  const response = await api.get(`/api/cases/${id}`, config);
  return response.data.caso as CasoData;
}

// Criar novo caso
export async function criarCaso(data: CasoCreateData, token: string) {
  const response = await api.post('/api/cases', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.caso as CasoData;
}

// Atualizar caso
export async function atualizarCaso(id: string, data: Partial<CasoData>, token: string) {
  const response = await api.put(`/api/cases/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.caso as CasoData;
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
