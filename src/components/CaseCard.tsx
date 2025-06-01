import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Heading, Body, Caption } from './Typography';
import { Ionicons } from '@expo/vector-icons';

export interface Caso {
  _id: string;
  titulo: string;
  responsavel: string;
  dataAbertura: string;
  status: 'pending' | 'in_progress' | 'completed';
  descricao?: string;
  tipo?: string;
  sexo?: string;
  local?: string;
}

interface CaseCardProps {
  title: string;
  patientName: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  description?: string;
  type?: string;
  location?: string;
  onPress: () => void;
}

const getStatusStyle = (status: CaseCardProps['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'in_progress':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'pending':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: CaseCardProps['status']) => {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'in_progress':
      return 'Em Andamento';
    case 'pending':
      return 'Pendente';
    default:
      return 'Desconhecido';
  }
};

export const CaseCard = ({ 
  title, 
  patientName, 
  date, 
  status, 
  description,
  type,
  location,
  onPress 
}: CaseCardProps) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-gray-800/80 rounded-lg p-4 mx-4 my-2 border border-gray-700 active:bg-gray-700/80"
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-2">
          <Heading size="small" className="text-gray-100 mb-1">
            {title}
          </Heading>
          {type && (
            <View className="flex-row items-center mb-1">
              <Ionicons name="medical-outline" size={14} color="#9CA3AF" />
              <Caption className="text-gray-400 ml-1">{type}</Caption>
            </View>
          )}
        </View>
        <View className={`px-3 py-1 rounded-full border ${getStatusStyle(status)}`}>
          <Caption className="text-xs font-medium">
            {getStatusText(status)}
          </Caption>
        </View>
      </View>
      
      <View className="flex-row items-center mb-2">
        <Ionicons name="person-outline" size={14} color="#9CA3AF" />
        <Body className="text-gray-300 ml-1">
          {patientName}
        </Body>
      </View>

      {location && (
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={14} color="#9CA3AF" />
          <Caption className="text-gray-400 ml-1">{location}</Caption>
        </View>
      )}
      
      {description && (
        <View className="mt-2 pt-2 border-t border-gray-700">
          <Caption className="text-gray-400">{description}</Caption>
        </View>
      )}

      <View className="flex-row items-center mt-2 pt-2 border-t border-gray-700">
        <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
        <Caption className="text-gray-400 ml-1">
          {new Date(date).toLocaleDateString('pt-BR')}
        </Caption>
      </View>
    </TouchableOpacity>
  );
}; 