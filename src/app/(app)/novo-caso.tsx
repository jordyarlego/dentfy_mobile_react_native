"use client";

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Heading, Body } from '../../components/Typography';
import HeaderPerito from '../../components/header';
import { useToast } from '../../contexts/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Caso } from '../../types/caso';

interface CasoData extends Omit<Caso, '_id' | 'vitimas' | 'evidencias' | 'peritos'> {
  vitimas?: Caso['vitimas'];
  evidencias?: Caso['evidencias'];
  peritos?: Caso['peritos'];
}

const STORAGE_KEY = '@dentify_casos';

export default function NovoCaso() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CasoData>({
    titulo: '',
    descricao: '',
    responsavel: '',
    status: 'em_andamento',
    dataAbertura: new Date().toISOString().split('T')[0],
    sexo: 'masculino',
    local: '',
    vitimas: [],
    evidencias: [],
    peritos: [],
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CasoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError(null);

    // Validações
    if (!formData.titulo.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (!formData.descricao.trim()) {
      setError("A descrição é obrigatória");
      return;
    }

    if (!formData.responsavel.trim()) {
      setError("O responsável é obrigatório");
      return;
    }

    if (!formData.local.trim()) {
      setError("O local é obrigatório");
      return;
    }

    try {
      // Busca casos existentes
      const storedCasos = await AsyncStorage.getItem(STORAGE_KEY);
      const casosExistentes = storedCasos ? JSON.parse(storedCasos) : [];

      // Cria novo caso
      const novoCaso: Caso = {
        _id: Date.now().toString(),
        ...formData,
        vitimas: formData.vitimas || [],
        evidencias: formData.evidencias || [],
        peritos: formData.peritos || [],
      };

      // Adiciona o novo caso à lista
      const casosAtualizados = [novoCaso, ...casosExistentes];
      
      // Salva no AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(casosAtualizados));

      showToast('Caso criado com sucesso!', 'success');
      router.push('/casos');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao criar caso.");
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito showBackButton />
      
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Heading size="large" className="text-gray-100 mb-2">Novo Caso</Heading>
          <Body className="text-gray-400">Preencha os dados do novo caso odontolegal</Body>
        </View>

        <View className="space-y-4">
          {/* Título */}
          <View>
            <Body className="text-amber-500 mb-2">Título</Body>
            <TextInput
              value={formData.titulo}
              onChangeText={(value) => handleChange('titulo', value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30"
              placeholder="Digite o título do caso"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Data de Abertura */}
          <View>
            <Body className="text-amber-500 mb-2">Data de Abertura</Body>
            <TextInput
              value={formData.dataAbertura}
              onChangeText={(value) => handleChange('dataAbertura', value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30"
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Local */}
          <View>
            <Body className="text-amber-500 mb-2">Local</Body>
            <TextInput
              value={formData.local}
              onChangeText={(value) => handleChange('local', value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30"
              placeholder="Digite o local do caso"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Responsável */}
          <View>
            <Body className="text-amber-500 mb-2">Responsável</Body>
            <TextInput
              value={formData.responsavel}
              onChangeText={(value) => handleChange('responsavel', value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30"
              placeholder="Digite o nome do responsável"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Descrição */}
          <View>
            <Body className="text-amber-500 mb-2">Descrição</Body>
            <TextInput
              value={formData.descricao}
              onChangeText={(value) => handleChange('descricao', value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30 min-h-[100px]"
              placeholder="Digite a descrição do caso"
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>

          {error && (
            <View className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <Body className="text-red-400">{error}</Body>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View className="p-4 border-t border-gray-800 bg-gray-900">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-3 rounded-lg border border-gray-700"
          >
            <Body className="text-gray-400 text-center">Cancelar</Body>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 p-3 bg-amber-600 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Body className="text-white ml-2">Salvar Caso</Body>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
} 