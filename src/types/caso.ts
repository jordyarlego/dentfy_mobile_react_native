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
  titulo: string;
  dataColeta: string;
  tipo: string;
  local: string;
  coletadaPor: string;
  descricao: string;
  imagemUri?: string;
  createdAt: string;
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