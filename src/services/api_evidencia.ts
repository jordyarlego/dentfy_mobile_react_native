import { AxiosError } from "axios";
import api from "./api";

export interface Evidencia {
  _id: string;
  tipo: "imagem" | "texto";
  titulo: string;
  dataColeta: Date | string;
  coletadoPor: string; // Removido o opcional
  responsavel?: string;
  caso: string;
  periciado?: string;
  localColeta: string;
  latitude?: number;
  longitude?: number;
  imagemURL?: string;
  descricao: string;
  createdAt: string;
}

export interface CriarEvidenciaDTO {
  tipo: "imagem" | "texto";
  titulo: string;
  dataColeta: Date | string;
  coletadoPor: string; // Removido o opcional
  responsavel?: string;
  caso: string;
  periciado?: string;
  localColeta: string;
  latitude?: number;
  longitude?: number;
  imagem?: {
    uri: string;
    type?: string;
    name?: string;
  };
  descricao: string;
}

export interface AtualizarEvidenciaDTO
  extends Partial<Omit<Evidencia, "_id">> {}

interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Criar nova evidência
export const criarEvidencia = async (
  dados: CriarEvidenciaDTO
): Promise<Evidencia> => {
  try {
    const formData = new FormData();

    // Log para debug
    console.log("Dados recebidos:", {
      ...dados,
      coletadoPor: dados.coletadoPor || "não definido",
    });

    // Tratar campos normais
    Object.entries(dados).forEach(([key, value]) => {
      if (key !== "imagem" && value !== undefined) {
        // Garantir que coletadoPor seja enviado corretamente
        if (key === "coletadoPor") {
          console.log("Adicionando coletadoPor:", value);
        }
        formData.append(key, String(value));
      }
    });

    // Tratar imagem
    if (dados.imagem?.uri) {
      const uriParts = dados.imagem.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("imagem", {
        uri: dados.imagem.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    console.log("Dados sendo enviados:", {
      ...dados,
      imagem: dados.imagem ? "presente" : "ausente",
    });

    const response = await api.post<Evidencia>("/api/evidences", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data) => data,
    });

    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error("Erro detalhado:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
    } as ApiError);
    throw error;
  }
};

// Buscar evidências de um caso
export const buscarEvidenciasPorCaso = async (
  casoId: string
): Promise<Evidencia[]> => {
  try {
    const response = await api.get<Evidencia[]>(`/api/evidences/${casoId}`);
    console.log("Evidências recebidas:", response.data); // Debug
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evidências:", error);
    throw error;
  }
};

// Atualizar evidência
export const atualizarEvidencia = async (
  id: string,
  dados: AtualizarEvidenciaDTO
): Promise<Evidencia> => {
  try {
    const response = await api.patch<Evidencia>(`/api/evidences/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar evidência:", error);
    throw error;
  }
};

// Deletar evidência
export const deletarEvidencia = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/evidences/${id}`);
  } catch (error) {
    console.error("Erro ao deletar evidência:", error);
    throw error;
  }
};
