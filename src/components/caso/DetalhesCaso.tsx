import React from 'react';
import { View, Text } from 'react-native';
import type { Caso } from '../../types/caso';

interface DetalhesCasoProps {
  caso: Caso;
}

export default function DetalhesCaso({ caso }: DetalhesCasoProps) {
  const getStatusStyle = (status: Caso['status']) => {
    switch (status) {
      case 'concluido':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'em_andamento':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'arquivado':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: Caso['status']) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'em_andamento':
        return 'Em Andamento';
      case 'arquivado':
        return 'Arquivado';
      default:
        return status;
    }
  };

  return (
    <View className="mb-6">
      <View className="bg-gray-800/30 p-4 rounded-lg">
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F59E0B', marginBottom: 8 }}>
          Detalhes do Caso
        </Text>
        
        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Text style={{ fontSize: 16, color: '#D1D5DB', flex: 1, marginRight: 8 }}>
              {caso.titulo}
            </Text>
            <View className={`px-3 py-1 rounded-full border ${getStatusStyle(caso.status)}`}>
              <Text style={{ fontSize: 12 }}>
                {getStatusText(caso.status)}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            <Text style={{ fontWeight: '500', color: '#F59E0B' }}>Descrição: </Text>
            {caso.descricao}
          </Text>

          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            <Text style={{ fontWeight: '500', color: '#F59E0B' }}>Responsável: </Text>
            {caso.responsavel}
          </Text>

          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            <Text style={{ fontWeight: '500', color: '#F59E0B' }}>Local: </Text>
            {caso.local}
          </Text>

          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            <Text style={{ fontWeight: '500', color: '#F59E0B' }}>Data de Abertura: </Text>
            {new Date(caso.dataAbertura).toLocaleDateString('pt-BR')}
          </Text>

          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            <Text style={{ fontWeight: '500', color: '#F59E0B' }}>Sexo: </Text>
            {caso.sexo}
          </Text>
        </View>
      </View>
    </View>
  );
} 