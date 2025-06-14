'use client';

import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '@/components/header';
import DetalhesCaso from '@/components/caso/DetalhesCaso';
import ListaVitimas from '@/components/caso/ListaVitimas';
import ListaEvidencias from '@/components/caso/ListaEvidencias';
import { useToast } from '@/contexts/ToastContext';
import type { Caso } from '@/types/caso';
import { Heading, Body } from '@/components/Typography';
import { colors } from '@/theme/colors';
import { buscarCasoCompleto } from '@/services/caso';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetalhesCasoPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  const [caso, setCaso] = useState<Caso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      carregarCaso(id as string);
    }
  }, [id]);

  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        console.log('Tela recebeu foco, recarregando caso:', id);
        carregarCaso(id as string);
      }
    }, [id])
  );

  const carregarCaso = async (casoId: string) => {
    try {
      setLoading(true);
      
      // Primeiro, carregar o caso do AsyncStorage para preservar dados locais
      const casosStr = await AsyncStorage.getItem('@dentify_casos');
      let casoLocal = null;
      if (casosStr) {
        const casos = JSON.parse(casosStr);
        casoLocal = casos.find((c: any) => String(c._id) === String(casoId));
      }

      // Buscar dados atualizados do backend
      const data = await buscarCasoCompleto(casoId);
      
      // Garante que todas as listas sejam arrays, mesmo que vazios
      const casoFormatado: Caso = {
        ...data.caso,
        vitimas: Array.isArray(data.caso.vitimas) ? data.caso.vitimas : [],
        peritos: Array.isArray(data.caso.peritos) ? data.caso.peritos : [],
        // Preserva as evidências locais se existirem
        evidencias: casoLocal?.evidencias || [],
      };
      
      // Atualizar o caso no AsyncStorage
      let casos = [];
      if (casosStr) {
        casos = JSON.parse(casosStr);
      }
      
      const casoIndex = casos.findIndex((c: any) => String(c._id) === String(casoFormatado._id));
      if (casoIndex !== -1) {
        casos[casoIndex] = casoFormatado;
      } else {
        casos.push(casoFormatado);
      }
      
      await AsyncStorage.setItem('@dentify_casos', JSON.stringify(casos));
      console.log('Caso atualizado no AsyncStorage:', casoFormatado._id);
      
      setCaso(casoFormatado);
    } catch (error: any) {
      console.error('Erro ao carregar caso:', error);
      showToast(error.message || 'Erro ao carregar caso', 'error');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-dentfyDarkBlue">
        <ActivityIndicator size="large" color={colors.dentfyAmber} />
        <Body className="text-dentfyTextPrimary mt-4">Carregando caso...</Body>
      </View>
    );
  }

  if (!caso) {
    return (
      <View className="flex-1 justify-center items-center bg-dentfyDarkBlue p-4">
        <Body className="text-dentfyTextSecondary">Caso não encontrado</Body>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />

      <ScrollView className="flex-1 p-4">
        <DetalhesCaso casoId={caso._id} />

        <View className="flex-row justify-between mt-4 px-4">
          <TouchableOpacity
            onPress={() => router.push(`/caso/${id}/localizacoes`)}
            className="flex-row items-center bg-amber-600 px-4 py-2 rounded-lg"
          >
            <Ionicons name="map-outline" size={20} color="white" />
            <Body className="text-white ml-2">Localizações</Body>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/caso/${id}/relatorio`)}
            className="flex-row items-center bg-dentfyAmber px-4 py-2 rounded-lg"
          >
            <Ionicons name="document-text-outline" size={20} color="white" />
            <Body className="text-white ml-2">Relatório do Caso</Body>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <ListaVitimas casoId={caso._id} />
        </View>

        <View className="mt-6 mb-6">
          <ListaEvidencias casoId={caso._id} />
        </View>
      </ScrollView>
    </View>
  );
} 