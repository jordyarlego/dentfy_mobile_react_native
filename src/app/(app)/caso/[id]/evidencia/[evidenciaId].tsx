import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Evidencia } from '../../../../../types/caso';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
};

export default function EditarEvidencia() {
  const { id, evidenciaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Evidencia | null>(null);

  useEffect(() => {
    carregarEvidencia();
  }, [id, evidenciaId]);

  const carregarEvidencia = async () => {
    try {
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      if (!casosStr) {
        throw new Error('Caso não encontrado');
      }

      const casos = JSON.parse(casosStr);
      const caso = casos.find((c: any) => c._id === id);
      if (!caso) {
        throw new Error('Caso não encontrado');
      }

      const evidencia = caso.evidencias.find((e: Evidencia) => e._id === evidenciaId);
      if (!evidencia) {
        throw new Error('Evidência não encontrada');
      }

      setFormData(evidencia);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar evidência', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Evidencia, value: string) => {
    if (!formData) return;
    setFormData((prev: Evidencia | null) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setSaving(true);

      // Validar campos obrigatórios
      const camposObrigatorios: (keyof Omit<Evidencia, '_id'>)[] = [
        'titulo',
        'descricao',
        'tipo',
        'coletadaPor',
        'dataColeta',
        'local',
      ];

      const camposFaltantes = camposObrigatorios.filter(
        (campo) => !formData[campo]
      );

      if (camposFaltantes.length > 0) {
        Alert.alert(
          'Campos obrigatórios',
          'Por favor, preencha todos os campos obrigatórios.'
        );
        return;
      }

      // Carregar caso atual
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      if (!casosStr) {
        throw new Error('Caso não encontrado');
      }

      const casos = JSON.parse(casosStr);
      const casoIndex = casos.findIndex((c: any) => c._id === id);
      if (casoIndex === -1) {
        throw new Error('Caso não encontrado');
      }

      // Atualizar evidência
      const evidenciaIndex = casos[casoIndex].evidencias.findIndex(
        (e: Evidencia) => e._id === evidenciaId
      );
      if (evidenciaIndex === -1) {
        throw new Error('Evidência não encontrada');
      }

      casos[casoIndex].evidencias[evidenciaIndex] = formData;
      await AsyncStorage.setItem(STORAGE_KEYS.CASOS, JSON.stringify(casos));

      Alert.alert('Sucesso', 'Evidência atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar evidência');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text style={{ color: '#9CA3AF' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-4">
        <View className="mb-6">
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 8 }}>
            Editar Evidência
          </Text>
          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            Atualize os dados da evidência abaixo.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Título *</Text>
            <TextInput
              value={formData.titulo}
              onChangeText={(value) => handleChange('titulo', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o título"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Descrição *</Text>
            <TextInput
              value={formData.descricao}
              onChangeText={(value) => handleChange('descricao', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite a descrição"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Tipo *</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => handleChange('tipo', 'imagem')}
                className={`flex-1 p-3 rounded-lg border ${
                  formData.tipo === 'imagem'
                    ? 'bg-amber-600 border-amber-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: formData.tipo === 'imagem' ? '#FFFFFF' : '#D1D5DB',
                  }}
                >
                  Imagem
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChange('tipo', 'documento')}
                className={`flex-1 p-3 rounded-lg border ${
                  formData.tipo === 'documento'
                    ? 'bg-amber-600 border-amber-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    color: formData.tipo === 'documento' ? '#FFFFFF' : '#D1D5DB',
                  }}
                >
                  Documento
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Coletada por *</Text>
            <TextInput
              value={formData.coletadaPor}
              onChangeText={(value) => handleChange('coletadaPor', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o nome do coletor"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Data de coleta *</Text>
            <TextInput
              value={formData.dataColeta}
              onChangeText={(value) => handleChange('dataColeta', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Local *</Text>
            <TextInput
              value={formData.local}
              onChangeText={(value) => handleChange('local', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o local"
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        <View className="flex-row gap-4 mt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <Text style={{ textAlign: 'center', color: '#D1D5DB' }}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={saving}
            className="flex-1 p-4 bg-amber-600 rounded-lg"
          >
            <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 