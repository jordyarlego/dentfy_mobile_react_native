import api from "./api";

export interface Laudo {
  _id: string;
  titulo: string;
  texto: string;
  evidence: string;
  peritoResponsavel: string;
  isSigned: boolean;
  createdAt: string;
}

export interface CriarLaudoDTO {
  titulo: string;
  texto: string;
  evidence: string;
  peritoResponsavel: string;
}

export interface AtualizarLaudoDTO extends Partial<Omit<Laudo, "_id">> {}

// Criar novo laudo
export const criarLaudo = async (dados: CriarLaudoDTO): Promise<Laudo> => {
  try {
    const response = await api.post<Laudo>("/api/laudos", dados);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar laudo:", error.response?.data || error);
    throw error;
  }
};

// Buscar laudo por ID
export const buscarLaudoPorId = async (id: string): Promise<Laudo> => {
  try {
    const response = await api.get<Laudo>(`/api/laudos/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar laudo:", error.response?.data || error);
    throw error;
  }
};

// Atualizar laudo
export const atualizarLaudo = async (
  id: string,
  dados: AtualizarLaudoDTO
): Promise<Laudo> => {
  try {
    const response = await api.put<Laudo>(`/api/laudos/${id}`, dados);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar laudo:", error.response?.data || error);
    throw error;
  }
};

// Deletar laudo
export const deletarLaudo = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/laudos/${id}`);
  } catch (error: any) {
    console.error("Erro ao deletar laudo:", error.response?.data || error);
    throw error;
  }
};

// Assinar laudo
export const assinarLaudo = async (
  id: string
): Promise<{ message: string; assinatura: string }> => {
  try {
    const response = await api.post(`/api/laudos/${id}/assinar`, {});
    return response.data;
  } catch (error: any) {
    console.error("Erro ao assinar laudo:", error.response?.data || error);
    throw error;
  }
};

// Gerar PDF do laudo
export const gerarPDFLaudo = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/api/laudos/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao gerar PDF do laudo:", error.response?.data || error);
    throw error;
  }
};

// Buscar laudos por evidência
export const buscarLaudosPorEvidencia = async (
  evidenceId: string
): Promise<Laudo[]> => {
  try {
    const response = await api.get(`/api/laudos/por-evidencia/${evidenceId}`);
    
    const data = response.data;

    // Se o backend retornar { laudos: [...] }
    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.laudos)) {
      return data.laudos;
    }

    // Caso retorne algo inesperado
    console.warn("Resposta inesperada ao buscar laudos:", data);
    return [];
  } catch (error: any) {
    console.error("Erro ao buscar laudos por evidência:", error.response?.data || error);
    return []; // <- garante que não vai retornar undefined
  }
};

// Listar todos os laudos
export const listarLaudos = async (): Promise<Laudo[]> => {
  try {
    const response = await api.get<Laudo[]>("/api/laudos");
    return response.data;
  } catch (error: any) {
    console.error("Erro ao listar laudos:", error.response?.data || error);
    throw error;
  }
};
