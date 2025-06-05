import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Heading, Body, Caption } from './Typography';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Tipo para a API
export type CasoStatusAPI = 'Em andamento' | 'Concluído' | 'Arquivado';

// Tipo para o frontend
export type CasoStatusFrontend = 'em_andamento' | 'concluido' | 'arquivado';

export interface CasoData {
  _id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: CasoStatusAPI;  // Agora usando o tipo da API
  tipo: 'Vitima' | 'Desaparecido' | 'Outro';
  dataAbertura: string;
  dataFechamento?: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  local: string;
}

// Função para converter status da API para o frontend
export const convertStatusToFrontend = (status: CasoStatusAPI): CasoStatusFrontend => {
  switch (status) {
    case 'Em andamento':
      return 'em_andamento';
    case 'Concluído':
      return 'concluido';
    case 'Arquivado':
      return 'arquivado';
    default:
      return 'em_andamento';
  }
};

// Função para converter status do frontend para a API
export const convertStatusToAPI = (status: CasoStatusFrontend): CasoStatusAPI => {
  switch (status) {
    case 'em_andamento':
      return 'Em andamento';
    case 'concluido':
      return 'Concluído';
    case 'arquivado':
      return 'Arquivado';
    default:
      return 'Em andamento';
  }
};

interface CaseCardProps {
  caso: CasoData;
  onPress: () => void;
}

const getStatusStyle = (status: CasoStatusAPI) => {
  const frontendStatus = convertStatusToFrontend(status);
  switch (frontendStatus) {
    case 'concluido':
      return 'bg-dentfyAmber/20 text-dentfyAmber border-dentfyAmber';
    case 'em_andamento':
      return 'bg-dentfyCyan/20 text-dentfyCyan border-dentfyCyan';
    case 'arquivado':
      return 'bg-errorRed/20 text-errorRed border-errorRed';
    default:
      return 'bg-dentfyGray600/20 text-dentfyTextSecondary border-dentfyGray600';
  }
};

const getStatusText = (status: CasoStatusAPI) => {
  return status; // Agora retornamos o status da API diretamente
};

const getTipoStyle = (tipo: CasoData['tipo']) => {
  return 'bg-dentfyGray800/50 border-dentfyBorderGray';
};

export const CaseCard = ({ caso, onPress }: CaseCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-dentfyGray800/80 rounded-lg p-4 mx-4 my-2 border border-dentfyBorderGray active:bg-dentfyGray700/80"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Heading 
            size="small" 
            className="text-dentfyTextPrimary mb-1 flex-wrap"
            numberOfLines={2}
          >
            {caso.titulo}
          </Heading>
          <View className="flex-row items-center mb-1">
            <View className={`px-3 py-1 rounded-full border ${getTipoStyle(caso.tipo)}`}>
              <Caption className="text-xs font-semibold text-dentfyAmber">
                {caso.tipo}
              </Caption>
            </View>
          </View>
        </View>

        <View className={`px-3 py-1 rounded-full border ${getStatusStyle(caso.status)}`}>
          <Caption className="text-xs font-semibold text-current">
            {getStatusText(caso.status)}
          </Caption>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="person-outline" size={14} color={colors.dentfyTextSecondary} />
        <Body 
          className="text-dentfyTextPrimary ml-1 flex-1" 
          numberOfLines={1}
        >
          {caso.responsavel}
        </Body>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={14} color={colors.dentfyTextSecondary} />
        <Caption 
          className="text-dentfyTextSecondary ml-1 flex-1" 
          numberOfLines={1}
        >
          {caso.local}
        </Caption>
      </View>

      {caso.descricao && (
        <View className="mt-2 pt-2 border-t border-dentfyBorderGray">
          <Caption 
            className="text-dentfyTextSecondary" 
            numberOfLines={2}
          >
            {caso.descricao}
          </Caption>
        </View>
      )}

      <View className="flex-row items-center mt-2 pt-2 border-t border-dentfyBorderGray">
        <Ionicons name="calendar-outline" size={14} color={colors.dentfyTextSecondary} />
        <Caption className="text-dentfyTextSecondary ml-1">
          {new Date(caso.dataAbertura).toLocaleDateString('pt-BR')}
        </Caption>
      </View>
    </TouchableOpacity>
  );
};
