import api from "./api";

export interface Relatorio {
  _id: string;
  titulo: string;
  conteudo: string;
  caso: string;
  peritoResponsavel: string;
  isSigned: boolean;
  dataCriacao: string;
}

export interface CriarRelatorioDTO {
  titulo: string;
  conteudo: string;
  caso: string;
  peritoResponsavel: string;
}

export interface AtualizarRelatorioDTO extends Partial<Omit<Relatorio, "_id">> {}

// Criar novo relatório
export const criarRelatorio = async (
  dados: CriarRelatorioDTO
): Promise<Relatorio> => {
  try {
    const response = await api.post<Relatorio>("/api/relatorio", dados);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao criar relatório:", error.response?.data || error);
    throw error;
  }
};

// Buscar relatório por ID
export const buscarRelatorioPorId = async (
  id: string
): Promise<Relatorio> => {
  try {
    const response = await api.get<Relatorio>(`/api/relatorio/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar relatório:", error.response?.data || error);
    throw error;
  }
};

// Atualizar relatório
export const atualizarRelatorio = async (
  id: string,
  dados: AtualizarRelatorioDTO
): Promise<Relatorio> => {
  try {
    const response = await api.put<Relatorio>(`/api/relatorio/${id}`, dados);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar relatório:", error.response?.data || error);
    throw error;
  }
};

// Deletar relatório
export const deletarRelatorio = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/relatorio/${id}`);
  } catch (error: any) {
    console.error("Erro ao deletar relatório:", error.response?.data || error);
    throw error;
  }
};

// Assinar relatório
export const assinarRelatorio = async (
  id: string
): Promise<{ message: string; assinatura: string }> => {
  try {
    const response = await api.post(`/api/relatorio/${id}/assinar`, {},);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao assinar relatório:", error.response?.data || error);
    throw error;
  }
};

// Gerar PDF do relatório
export const gerarPDFRelatorio = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/api/relatorio/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao gerar PDF do relatório:", error.response?.data || error);
    throw error;
  }
};

// Buscar relatórios de um caso
export const buscarRelatoriosPorCaso = async (
  casoId: string
): Promise<Relatorio[]> => {
  try {
    const response = await api.get<Relatorio[]>(`/api/relatorio/por-caso/${casoId}`);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar relatórios por caso:", error.response?.data || error);
    throw error;
  }
};
