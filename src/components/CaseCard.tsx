import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Heading, Body, Caption } from './Typography';
import { Ionicons } from '@expo/vector-icons';

export interface CasoData {
  _id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: 'Em andamento' | 'Finalizado' | 'Arquivado';
  tipo: 'Vitima' | 'Desaparecido' | 'Outro';
  dataAbertura: string;
  dataFechamento?: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  local: string;
}

interface CaseCardProps {
  caso: CasoData;
  onPress: () => void;
}

const getStatusStyle = (status: CasoData['status']) => {
  switch (status) {
    case 'Finalizado':
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'Em andamento':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Arquivado':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

export const CaseCard = ({ caso, onPress }: CaseCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-800/80 rounded-lg p-4 mx-4 my-2 border border-gray-700 active:bg-gray-700/80"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Heading size="small" className="text-gray-100 mb-1">
            {caso.titulo}
          </Heading>
          <View className="flex-row items-center mb-1">
            <Ionicons name="medical-outline" size={14} color="#9CA3AF" />
            <Caption className="text-gray-400 ml-1">{caso.tipo}</Caption>
          </View>
        </View>

        <View className={`px-3 py-1 rounded-full border ${getStatusStyle(caso.status)}`}>
          <Caption className="text-xs font-medium">
            {caso.status}
          </Caption>
        </View>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="person-outline" size={14} color="#9CA3AF" />
        <Body className="text-gray-300 ml-1">{caso.responsavel}</Body>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
        <Caption className="text-gray-400 ml-1">{caso.local}</Caption>
      </View>

      {caso.descricao && (
        <View className="mt-2 pt-2 border-t border-gray-700">
          <Caption className="text-gray-400">{caso.descricao}</Caption>
        </View>
      )}

      <View className="flex-row items-center mt-2 pt-2 border-t border-gray-700">
        <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
        <Caption className="text-gray-400 ml-1">
          {new Date(caso.dataAbertura).toLocaleDateString('pt-BR')}
        </Caption>
      </View>
    </TouchableOpacity>
  );
};
