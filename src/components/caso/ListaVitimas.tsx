import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Vitima } from '../../types/caso';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
} as const;

export interface ListaVitimasProps {
  casoId: string;
}

export default function ListaVitimas({ casoId }: ListaVitimasProps) {
  const router = useRouter();
  const [vitimas, setVitimas] = useState<Vitima[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const carregarVitimas = async () => {
    try {
      console.log('ListaVitimas: Carregando vítimas para caso:', casoId);
      setLoading(true);
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      console.log('ListaVitimas: Casos carregados:', casosStr ? 'Sim' : 'Não');

      if (!casosStr) {
        console.log('ListaVitimas: Nenhum caso encontrado');
        setVitimas([]);
        return;
      }

      const casos = JSON.parse(casosStr);
      console.log('ListaVitimas: Total de casos:', casos.length);
      
      const caso = casos.find((c: any) => String(c._id) === String(casoId));
      console.log('ListaVitimas: Caso encontrado:', caso ? 'Sim' : 'Não');
      console.log('ListaVitimas: Dados do caso:', JSON.stringify(caso, null, 2));
      
      if (!caso) {
        console.log('ListaVitimas: Caso não encontrado com ID:', casoId);
        setVitimas([]);
        return;
      }

      console.log('ListaVitimas: Vítimas encontradas:', caso.vitimas?.length || 0);
      console.log('ListaVitimas: Dados das vítimas:', JSON.stringify(caso.vitimas, null, 2));
      setVitimas(Array.isArray(caso.vitimas) ? caso.vitimas : []);
    } catch (error) {
      console.error('ListaVitimas: Erro ao carregar vítimas:', error);
      setVitimas([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarVitimas();
    }, [casoId])
  );

  const handleAddVitima = () => {
    router.push(`/caso/${casoId}/vitima/nova`);
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Heading size="medium" className="text-dentfyAmber">
          Vítimas
        </Heading>
        <TouchableOpacity
          onPress={handleAddVitima}
          className="p-2 rounded-full bg-dentfyAmber/10"
        >
          <Ionicons name="add" size={24} color={colors.dentfyAmber} />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg items-center justify-center min-h-[100px]">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextPrimary text-center mt-2">
            Carregando vítimas...
          </Body>
        </View>
      ) : vitimas.length === 0 ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg">
          <Body className="text-dentfyTextPrimary text-center">
            Nenhuma vítima registrada
          </Body>
        </View>
      ) : (
        <View className="space-y-2">
          {vitimas.map((vitima) => (
            <View key={vitima._id} className="bg-dentfyGray800/30 p-4 rounded-lg">
              <Body className="text-dentfyTextPrimary">
                {vitima.nome}
              </Body>
              <Body className="text-dentfyTextSecondary text-sm mt-1">
                CPF: {vitima.cpf}
              </Body>
            </View>
          ))}
        </View>
      )}

      {/* Modal de Feedback */}
      <Modal
        visible={isSubmitting}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-dentfyGray800 p-8 rounded-lg items-center min-w-[200px]">
            {isSaved ? (
              <>
                <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-4">
                  <Ionicons name="checkmark" size={40} color="white" />
                </View>
                <Body className="text-dentfyTextPrimary text-center text-lg font-medium">
                  Vítima salva com sucesso!
                </Body>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color={colors.dentfyAmber} />
                <Body className="text-dentfyTextPrimary mt-4 text-center text-lg">
                  Salvando vítima...
                </Body>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}