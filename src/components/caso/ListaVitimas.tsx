import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { buscarVitimasPorCaso } from '../../services/api_vitima'; // <-- AQUI
import type { Vitima } from '../../types/caso';

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
      setLoading(true);
      const data = await buscarVitimasPorCaso(casoId); // <-- AQUI
      setVitimas(data);
    } catch (error) {
      console.error('Erro ao carregar vítimas do backend:', error);
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
                {vitima.nomeCompleto}
              </Body>
              <Body className="text-dentfyTextSecondary text-sm mt-1">
                CPF: {vitima.cpf}
              </Body>
            </View>
          ))}
        </View>
      )}

      {/* Modal de Feedback */}
      <Modal visible={isSubmitting} transparent animationType="fade">
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
