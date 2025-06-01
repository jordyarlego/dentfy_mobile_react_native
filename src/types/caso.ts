export interface Vitima {
  _id: string;
  nome: string;
  dataNascimento: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  etnia: string;
  endereco: string;
  cpf: string;
  nic: string;
}

export interface Evidencia {
  _id: string;
  tipo: 'imagem' | 'documento' | 'outro';
  titulo: string;
  descricao: string;
  coletadoPor: string;
  dataColeta: string;
  local: string;
  arquivo?: string;
}

export interface Perito {
  _id: string;
  nome: string;
  especialidade: string;
  registro: string;
  dataInicio: string;
  dataFim?: string;
}

export interface Caso {
  _id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: 'em_andamento' | 'concluido' | 'arquivado';
  dataAbertura: string;
  sexo: 'masculino' | 'feminino' | 'outro';
  local: string;
  vitimas: Vitima[];
  evidencias: Evidencia[];
  peritos: Perito[];
} 