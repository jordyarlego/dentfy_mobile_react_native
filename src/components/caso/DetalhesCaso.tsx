import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Caso } from '@/types/caso';
import { Heading, Body } from '@/components/Typography';
import { colors } from '@/theme/colors';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
} as const;

interface DetalhesCasoProps {
  casoId: string;
}

export default function DetalhesCaso({ casoId }: DetalhesCasoProps) {
  const [loading, setLoading] = useState(true);
  const [caso, setCaso] = useState<Caso | null>(null);

  useEffect(() => {
    carregarCaso();
  }, [casoId]);

  const carregarCaso = async () => {
    try {
      setLoading(true);
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      
      if (!casosStr) {
        setCaso(null);
        return;
      }

      const casos = JSON.parse(casosStr);
      const casoEncontrado = casos.find((c: Caso) => String(c._id) === String(casoId));
      
      setCaso(casoEncontrado || null);
    } catch (error) {
      console.error('Erro ao carregar caso:', error);
      setCaso(null);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View className="mb-6 items-center justify-center py-8">
        <ActivityIndicator size="large" color={colors.dentfyAmber} />
        <Body className="text-dentfyTextPrimary mt-4">
          Carregando detalhes do caso...
        </Body>
      </View>
    );
  }

  if (!caso) {
    return (
      <View className="mb-6 items-center justify-center py-8">
        <Body className="text-dentfyTextPrimary text-center">
          Caso não encontrado
        </Body>
      </View>
    );
  }

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