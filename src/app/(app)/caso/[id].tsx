'use client';

import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '../../../components/header';
import DetalhesCaso from '../../../components/caso/DetalhesCaso';
import ListaVitimas from '../../../components/caso/ListaVitimas';
import ListaEvidencias from '../../../components/caso/ListaEvidencias';
import ListaPeritos from '../../../components/caso/ListaPeritos';
import { useToast } from '../../../contexts/ToastContext';
import type { Caso } from '../../../types/caso';
import { Heading, Body } from '../../../components/Typography';
import { colors } from '../../../theme/colors';
import { buscarCasoCompleto } from '../../../services/caso';

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

  const carregarCaso = async (casoId: string) => {
    try {
      setLoading(true);
      const data = await buscarCasoCompleto(casoId);
      
      // Garante que todas as listas sejam arrays, mesmo que vazios
      const casoFormatado: Caso = {
        ...data.caso,
        vitimas: Array.isArray(data.caso.vitimas) ? data.caso.vitimas : [],
        evidencias: Array.isArray(data.caso.evidencias) ? data.caso.evidencias : [],
        peritos: Array.isArray(data.caso.peritos) ? data.caso.peritos : [],
      };
      
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
    <View className="flex-1 bg-dentfyDarkBlue">
      <HeaderPerito />
      
      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full bg-dentfyGray800/30"
            >
              <Ionicons name="arrow-back" size={24} color={colors.dentfyAmber} />
            </TouchableOpacity>
            <Heading size="large" className="text-dentfyTextPrimary flex-1">
              Detalhes do Caso
            </Heading>
          </View>

          <DetalhesCaso caso={caso} />
          
          <ListaVitimas vitimas={caso.vitimas} />
          <ListaEvidencias evidencias={caso.evidencias} />
          <ListaPeritos peritos={caso.peritos} />
        </View>
      </ScrollView>
    </View>
  );
} 