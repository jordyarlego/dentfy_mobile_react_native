import api from "./api";

export interface Evidencia {
  _id: string;
  tipo: "imagem" | "documento";
  dataColeta: string;
  coletadaPor: string;
  descricao: string;
  caso: string;
  imagemUri?: string;
  titulo: string;
  local: string;
  createdAt: string;
}

export interface CriarEvidenciaDTO {
  tipo: "imagem" | "documento";
  dataColeta: string;
  coletadaPor: string;
  descricao: string;
  caso: string;
  titulo: string;
  local: string;
  imagemUri?: string; // URI da imagem no dispositivo móvel
}

export interface AtualizarEvidenciaDTO
  extends Partial<Omit<Evidencia, "_id">> {}

// Criar nova evidência
export const criarEvidencia = async (
  dados: CriarEvidenciaDTO
): Promise<Evidencia> => {
  try {
    const formData = new FormData();

    // Adiciona todos os campos exceto a imagem
    Object.entries(dados).forEach(([key, value]) => {
      if (key !== "imagemUri" && value !== undefined) {
        formData.append(key, value);
      }
    });

    // Adiciona a imagem se existir
    if (dados.imagemUri) {
      const uriParts = dados.imagemUri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("imagem", {
        uri: dados.imagemUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    const response = await api.post<Evidencia>("/api/evidences", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar evidência:", error);
    throw error;
  }
};

// Buscar evidências de um caso
export const buscarEvidenciasPorCaso = async (
  casoId: string
): Promise<Evidencia[]> => {
  try {
    const response = await api.get<Evidencia[]>(`/api/evidences/${casoId}`);
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
