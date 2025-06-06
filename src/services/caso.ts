import api from './api';
import type { CasoData, CasoStatusAPI } from '../components/CaseCard';
import type { Vitima, Evidencia, Perito } from '../types/caso';

// Tipo para criar caso
export type CasoCreateData = Omit<CasoData, '_id' | 'dataFechamento'> & {
  dataFechamento?: string;
};

// Buscar caso por ID com todas as informações (ajustado conforme rotas backend)
export const buscarCasoCompleto = async (id: string) => {
  try {
    const response = await api.get(`/api/cases/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar caso:', error.message);
    throw new Error(error.response?.data?.message || 'Erro ao buscar caso');
  }
};

// Buscar todos os casos
export async function buscarCasos() {
  try {
    const response = await api.get('/api/cases');
    return response.data.casos || [];
  } catch (error: any) {
    console.error('Erro ao buscar casos:', error.message);
    throw error;
  }
}

// Criar novo caso
export async function criarCaso(data: CasoCreateData) {
  try {
    const response = await api.post('/api/cases', data);
    return response.data.caso;
  } catch (error: any) {
    console.error('Erro ao criar caso:', error.message);
    throw error;
  }
}

// Atualizar caso
export async function atualizarCaso(id: string, data: Partial<CasoData>) {
  try {
    const response = await api.put(`/api/cases/${id}`, data);
    return response.data.caso;
  } catch (error: any) {
    console.error('Erro ao atualizar caso:', error.message);
    throw error;
  }
}

// Deletar caso
export async function deletarCaso(id: string) {
  try {
    const response = await api.delete(`/api/cases/${id}`);
    return response.data.message;
  } catch (error: any) {
    console.error('Erro ao deletar caso:', error.message);
    throw error;
  }
}

// Buscar vítimas de um caso
export async function buscarVitimas(casoId: string) {
  try {
    const response = await api.get(`/api/cases/${casoId}/vitimas`);
    return response.data.vitimas || [];
  } catch (error: any) {
    console.error('Erro ao buscar vítimas:', error.message);
    throw error;
  }
}

// Buscar evidências de um caso
export async function buscarEvidencias(casoId: string) {
  try {
    const response = await api.get(`/api/cases/${casoId}/evidencias`);
    return response.data.evidencias || [];
  } catch (error: any) {
    console.error('Erro ao buscar evidências:', error.message);
    throw error;
  }
}

// Buscar peritos de um caso
export async function buscarPeritos(casoId: string) {
  try {
    const response = await api.get(`/api/cases/${casoId}/peritos`);
    return response.data.peritos || [];
  } catch (error: any) {
    console.error('Erro ao buscar peritos:', error.message);
    throw error;
  }
}
