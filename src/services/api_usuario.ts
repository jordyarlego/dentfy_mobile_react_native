import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface apiUsuario {
  name: string;
  email: string;
  password: string;
  confirmarSenha: string;
  cpf: string;
  role: "perito" | "assistente";
  _id?: string;
  status?: boolean;
}

function traduzirErroValidacao(erro: string): string {
  if (erro.includes("email: Path `email` is invalid")) {
    return "O e-mail informado não é válido";
  }
  if (erro.includes("duplicate key error")) {
    if (erro.includes("cpf")) {
      return "Este CPF já está cadastrado";
    }
    if (erro.includes("email")) {
      return "Este e-mail já está cadastrado";
    }
  }
  if (erro.includes("User validation failed")) {
    return "Erro na validação dos dados";
  }
  return "Erro ao processar a requisição";
}

export async function PostUsuario(data: apiUsuario) {
  try {
    const token = await AsyncStorage.getItem("token");
    const response = await api.post("/api/users", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      const mensagemErro = traduzirErroValidacao(
        error.response.data.error || ""
      );
      throw new Error(mensagemErro);
    }
    if (error.response?.status === 403) {
      throw new Error("Você não tem permissão para criar usuários");
    }
    if (error.response?.status === 401) {
      throw new Error("Sua sessão expirou. Faça login novamente");
    }
    console.error("Erro ao criar usuario", error);
    throw new Error(
      "Não foi possível criar o usuário. Tente novamente mais tarde"
    );
  }
}

export async function GetUsuarios() {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar logado para acessar esta área");
    }

    const response = await api.get("/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        "Você não tem permissão para visualizar a lista de usuários"
      );
    }
    console.error("Erro ao carregar usuários:", error);
    throw error;
  }
}

export async function PutUsuario(id: string, data: apiUsuario) {
  console.log("Atualizando usuário:", id);
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await api.put(`/api/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      if (error.response.data.error?.includes("duplicate key error")) {
        throw new Error("CPF já cadastrado para outro usuário");
      }
    }
    console.error("Erro ao atualizar usuario", error);
    throw error;
  }
}

export async function DeleteUsuario(id: string) {
  console.log("Deletando usuário:", id);
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await api.delete(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário", error);
    throw error;
  }
}

export async function GetUsuarioById(id: string) {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      throw new Error("Você precisa estar logado para acessar esta área");
    }

    const response = await api.get(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error(
        "Você não tem permissão para visualizar os detalhes deste usuário"
      );
    }
    console.error("Erro ao carregar detalhes do usuário:", error);
    throw error;
  }
}
