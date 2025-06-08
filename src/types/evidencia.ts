import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import type { ImagePickerResult } from 'expo-image-picker';

export type TipoEvidencia = 'imagem' | 'documento';

export interface Evidencia {
  _id: string;
  titulo: string;
  dataColeta: string;
  tipo: TipoEvidencia;
  local: string;
  coletadaPor: string;
  descricao: string;
  imagemUri?: string;
  createdAt: string;
}

export interface Caso {
  _id: string;
  evidencias?: Evidencia[];
  // outros campos do caso...
}

export interface EvidenciaFormState extends Omit<Evidencia, '_id' | 'createdAt'> {}

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
    width: number;
    height: number;
    type?: string;
    fileName?: string;
    fileSize?: number;
  }>;
};

export type DateTimePickerResponse = {
  event: DateTimePickerEvent;
  date?: Date;
}; 