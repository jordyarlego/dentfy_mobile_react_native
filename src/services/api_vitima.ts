import api from "./api";
import { AxiosError } from "axios";

export interface Vitima {
  _id: string;
  nomeCompleto: string;
  endereco?: string;
  caso: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  cpf: string;
  etnia: "Preto" | "Pardo" | "Branco" | "Amarelo" | "Indígena" | "Outro";
  criadoEm: string;
  odontograma?: {
    numero: number;
    descricao: string;
  }[];
}

export interface CriarVitimaDTO extends Omit<Vitima, "_id" | "criadoEm"> {}
export interface AtualizarVitimaDTO
  extends Partial<Omit<Vitima, "_id" | "criadoEm">> {}

// Criar vítima
export const criarVitima = async (dados: CriarVitimaDTO): Promise<Vitima> => {
  try {
    const response = await api.post<Vitima>("/api/periciados", dados);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao criar vítima:", err.response?.data || err.message);
    throw error;
  }
};

// Listar todas as vítimas
export const listarVitimas = async (): Promise<Vitima[]> => {
  try {
    const response = await api.get<Vitima[]>("/api/periciados");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao listar vítimas:", err.response?.data || err.message);
    throw error;
  }
};

// Buscar vítima por ID
export const buscarVitimaPorId = async (id: string): Promise<Vitima> => {
  try {
    const response = await api.get<Vitima>(`/api/periciados/${id}`);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao buscar vítima:", err.response?.data || err.message);
    throw error;
  }
};

// Buscar vítimas por caso
export const buscarVitimasPorCaso = async (
  caseId: string
): Promise<Vitima[]> => {
  try {
    const response = await api.get<Vitima[]>(
      `/api/periciados/por-caso/${caseId}`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao buscar vítimas por caso:", err.response?.data || err.message);
    throw error;
  }
};

// Atualizar vítima
export const atualizarVitima = async (
  id: string,
  dados: AtualizarVitimaDTO
): Promise<Vitima> => {
  try {
    const response = await api.put<Vitima>(`/api/periciados/${id}`, dados);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao atualizar vítima:", err.response?.data || err.message);
    throw error;
  }
};

// Deletar vítima
export const deletarVitima = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/periciados/${id}`);
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao deletar vítima:", err.response?.data || err.message);
    throw error;
  }
};

// Atualizar odontograma
export const atualizarOdontogramaVitima = async (
  id: string,
  odontograma: { numero: number; descricao: string }[]
): Promise<Vitima> => {
  try {
    const response = await api.patch<Vitima>(
      `/api/periciados/${id}/odontograma`,
      { odontograma }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao atualizar odontograma:", err.response?.data || err.message);
    throw error;
  }
};

export const buscarOdontogramaVitima = async (
  id: string
): Promise<{ numero: number; descricao: string }[]> => {
  try {
    const response = await api.get<{ numero: number; descricao: string }[]>(
      `/api/periciados/${id}/odontograma`
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro ao buscar odontograma:", err.response?.data || err.message);
    throw error;
  }
};