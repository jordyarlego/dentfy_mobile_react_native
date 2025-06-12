import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import type { ImagePickerResult } from "expo-image-picker";

export type TipoEvidencia = "imagem" | "documento";

export interface Evidencia {
  _id: string;
  tipo: "imagem" | "texto";
  titulo: string;
  dataColeta: Date | string;
  coletadoPor?: string; // Agora opcional
  responsavel?: string; // Agora opcional
  caso: string;
  periciado?: string; // Agora opcional
  localColeta: string;
  latitude?: number;
  longitude?: number;
  imagemURL?: string;
  descricao: string;
  createdAt: string;
}

export interface Caso {
  _id: string;
  evidencias?: Evidencia[];
  // outros campos do caso...
}

export interface EvidenciaFormState {
  tipo: "imagem" | "texto";
  titulo: string;
  dataColeta: Date | string;
  coletadoPor: string;
  responsavel: string;
  caso: string;
  periciado: string;
  localColeta: string;
  latitude?: number;
  longitude?: number;
  imagemURL?: string;
  descricao: string;
}

export interface NovaEvidenciaState {
  isSubmitting: boolean;
  isSaved: boolean;
  showDatePicker: boolean;
  form: EvidenciaFormState;
}

export type ImagePickerResponse = ImagePickerResult & {
  canceled: boolean;
  assets: Array<{
    uri: string;
    // ... outros campos do asset
  }>;
};

export type DateTimePickerResponse = {
  type: string;
  nativeEvent: {
    timestamp?: number;
  };
};
