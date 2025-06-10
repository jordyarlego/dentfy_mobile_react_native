import api from "./api";

// Tipagem da vítima (periciado)
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
  odontogramas?: Odontograma[];
}

// Nova interface para odontograma
export interface Odontograma {
  id: string;
  dataCriacao: string;
  totalAvarias: number;
  avarias: Record<string, string>;
  resumo: string;
  imagemComIcones: boolean;
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
    console.error("Erro ao criar vítima:", error.response?.data || error);
    throw error;
  }
};

// Listar todas as vítimas
export const listarVitimas = async (): Promise<Vitima[]> => {
  try {
    const response = await api.get<Vitima[]>("/api/periciados");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar vítimas:", error.response?.data || error);
    throw error;
  }
};

// Buscar vítima por ID
export const buscarVitimaPorId = async (id: string): Promise<Vitima> => {
  try {
    const response = await api.get<Vitima>(`/api/periciados/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vítima:", error.response?.data || error);
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
    console.error("Erro ao buscar vítimas por caso:", error.response?.data || error);
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
    console.error("Erro ao atualizar vítima:", error.response?.data || error);
    throw error;
  }
};

// Adicionar odontograma à vítima
export const adicionarOdontograma = async (
  vitimaId: string,
  odontograma: Odontograma
): Promise<Vitima> => {
  try {
    const response = await api.post<Vitima>(`/api/periciados/${vitimaId}/odontogramas`, odontograma);
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar odontograma:", error.response?.data || error);
    throw error;
  }
};

// Deletar vítima
export const deletarVitima = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/periciados/${id}`);
  } catch (error) {
    console.error("Erro ao deletar vítima:", error.response?.data || error);
    throw error;
  }
};
