// Tipos básicos
export type Sexo = 'masculino' | 'feminino' | 'outro';
export type Etnia = 'branca' | 'preta' | 'parda' | 'amarela' | 'indigena' | 'outro';
export type TipoEvidencia = 'imagem' | 'documento';
export type LocationType = 'caso' | 'periciado' | 'evidencia';

// Interfaces principais
export interface Vitima {
  _id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: Sexo;
  etnia: Etnia;
  endereco: string;
  nic: string;
  latitude?: number;
  longitude?: number;
}

export interface Periciado {
  _id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: Sexo;
  etnia: Etnia;
  endereco: string;
  latitude?: number;
  longitude?: number;
}

export interface Evidencia {
  _id: string;
  titulo: string;
  descricao: string;
  tipo: TipoEvidencia;
  coletadaPor: string;
  dataColeta: string;
  local: string;
  imagemUri?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface Location {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  type: LocationType;
}

export interface Perito {
  _id: string;
  nome: string;
  matricula: string;
  cargo: string;
  email: string;
  telefone: string;
}

export interface Caso {
  _id: string;
  numero: string;
  data: string;
  tipo: string;
  descricao: string;
  status: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  vitimas: Vitima[];
  periciados: Periciado[];
  evidencias: Evidencia[];
  peritos: Perito[];
  createdAt: string;
  updatedAt: string;
}

// Tipos para formulários
export interface VitimaFormState {
  nome: string;
  cpf: string;
  dataNascimento: Date;
  sexo: Sexo;
  etnia: Etnia;
  endereco: string;
  nic: string;
}

export interface PericiadoFormState {
  nome: string;
  cpf: string;
  dataNascimento: Date;
  sexo: Sexo;
  etnia: Etnia;
  endereco: string;
}

export interface EvidenciaFormState {
  titulo: string;
  descricao: string;
  tipo: TipoEvidencia;
  coletadaPor: string;
  dataColeta: string;
  local: string;
  imagemUri?: string;
}

// Tipos para estado dos componentes
export interface NovaVitimaState {
  isSubmitting: boolean;
  isSaved: boolean;
  showDatePicker: boolean;
  form: VitimaFormState;
}

export interface NovaPericiadoState {
  isSubmitting: boolean;
  isSaved: boolean;
  showDatePicker: boolean;
  form: PericiadoFormState;
}

export interface NovaEvidenciaState {
  isSubmitting: boolean;
  isSaved: boolean;
  showDatePicker: boolean;
  form: EvidenciaFormState;
}

// Tipos para respostas da API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CasoResponse {
  caso: Caso;
  vitimas: Vitima[];
  periciados: Periciado[];
  evidencias: Evidencia[];
  peritos: Perito[];
}

// Tipos para armazenamento local
export interface StorageKeys {
  CASOS: '@dentify_casos';
  AUTH: '@dentify_auth';
  USER: '@dentify_user';
}

export const STORAGE_KEYS: StorageKeys = {
  CASOS: '@dentify_casos',
  AUTH: '@dentify_auth',
  USER: '@dentify_user',
} as const; 