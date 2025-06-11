export interface Usuario {
  _id: string;
  name: string;
  email: string;
  cpf: string;
  role: "perito" | "assistente";
  status: boolean | "true" | "false" | undefined;
}
