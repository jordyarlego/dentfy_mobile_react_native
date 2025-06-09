import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { buscarVitimasPorCaso } from '../../services/api_vitima';
import type { Vitima } from '../../services/api_vitima';

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
      const data = await buscarVitimasPorCaso(casoId);
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

  const handleVitimaPress = (vitimaId: string) => {
    router.push(`/caso/${casoId}/vitima/${vitimaId}`);
  };

  const formatarCPF = (cpf: string) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatarData = (data: string) => {
    if (!data) return '';
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return data;
    }
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
        <View className="space-y-4">
          {vitimas.map((vitima, index) => (
            <View key={vitima._id}>
              <TouchableOpacity
                onPress={() => handleVitimaPress(vitima._id)}
                className="bg-dentfyGray800/30 p-4 rounded-lg border border-dentfyGray700/30 active:bg-dentfyGray800/50"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Body className="text-dentfyTextPrimary font-semibold text-lg mb-2">
                      {vitima.nomeCompleto}
                    </Body>
                    
                    <View className="space-y-1">
                      <View className="flex-row items-center">
                        <Ionicons name="card-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          CPF: {formatarCPF(vitima.cpf)}
                        </Body>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Nascimento: {formatarData(vitima.dataNascimento)}
                        </Body>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Sexo: {vitima.sexo}
                        </Body>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="people-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Etnia: {vitima.etnia}
                        </Body>
                      </View>
                      
                      {vitima.endereco && (
                        <View className="flex-row items-start">
                          <Ionicons name="location-outline" size={16} color={colors.dentfyTextSecondary} style={{ marginTop: 2 }} />
                          <Body className="text-dentfyTextSecondary text-sm ml-2 flex-1">
                            {vitima.endereco}
                          </Body>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View className="ml-3">
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={colors.dentfyTextSecondary} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* Separador âmbar entre cards (exceto no último) */}
              {index < vitimas.length - 1 && (
                <View className="h-0.5 bg-dentfyAmber/20 mx-4 mt-4 rounded-full" />
              )}
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
