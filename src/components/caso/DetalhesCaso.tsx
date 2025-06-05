import React from 'react';
import { View, Text } from 'react-native';
import type { Caso } from '../../types/caso';
import { Heading, Body } from '../Typography';

interface DetalhesCasoProps {
  caso: Caso;
}

export default function DetalhesCaso({ caso }: DetalhesCasoProps) {
  const getStatusStyle = (status: Caso['status']) => {
    switch (status) {
      case 'concluido':
        return 'bg-successGreen/10 text-successGreen border-successGreen/30';
      case 'em_andamento':
        return 'bg-dentfyAmber/10 text-dentfyAmber border-dentfyAmber/30';
      case 'arquivado':
        return 'bg-errorRed/10 text-errorRed border-errorRed/30';
      default:
        return 'bg-dentfyGray600/10 text-dentfyGray600 border-dentfyGray600/30';
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
      <View className="bg-dentfyGray800/30 p-4 rounded-lg">
        <Heading size="large" className="text-dentfyAmber mb-2">
          Detalhes do Caso
        </Heading>
        
        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Body className="text-dentfyTextPrimary flex-1 mr-2">
              {caso.titulo}
            </Body>
            <View className={`px-3 py-1 rounded-full border ${getStatusStyle(caso.status)}`}>
              <Body size="small" className="text-current">
                {getStatusText(caso.status)}
              </Body>
            </View>
          </View>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Descrição: </Text>
            {caso.descricao}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Responsável: </Text>
            {caso.responsavel}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Local: </Text>
            {caso.local}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Data de Abertura: </Text>
            {new Date(caso.dataAbertura).toLocaleDateString('pt-BR')}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Sexo: </Text>
            {caso.sexo}
          </Body>
        </View>
      </View>
    </View>
  );
} 