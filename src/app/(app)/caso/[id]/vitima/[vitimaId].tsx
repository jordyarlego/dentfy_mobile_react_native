import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  CASOS: 'casos',
};

export default function EditarVitima() {
  const { id, vitimaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any | null>(null);

  useEffect(() => {
    carregarVitima();
  }, [id, vitimaId]);

  const carregarVitima = async () => {
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

      const vitima = caso.vitimas.find((v: any) => v._id === vitimaId);
      if (!vitima) {
        throw new Error('Vítima não encontrada');
      }

      setFormData(vitima);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar vítima', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof any, value: string) => {
    if (!formData) return;
    setFormData((prev: any | null) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setSaving(true);

      // Validar campos obrigatórios
      const camposObrigatorios: (keyof Omit<any, '_id'>)[] = [
        'nome',
        'dataNascimento',
        'sexo',
        'etnia',
        'endereco',
        'cpf',
        'nic',
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

      // Atualizar vítima
      const vitimaIndex = casos[casoIndex].vitimas.findIndex(
        (v: any) => v._id === vitimaId
      );
      if (vitimaIndex === -1) {
        throw new Error('Vítima não encontrada');
      }

      casos[casoIndex].vitimas[vitimaIndex] = formData;
      await AsyncStorage.setItem(STORAGE_KEYS.CASOS, JSON.stringify(casos));

      Alert.alert('Sucesso', 'Vítima atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar vítima');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-gray-400">Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-4">
        <View className="mb-6">
          <Text className="text-amber-500 mb-2 text-2xl font-bold">
            Editar Vítima
          </Text>
          <Text className="text-gray-300">
            Atualize os dados da vítima abaixo.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-300 mb-1">Nome completo *</Text>
            <TextInput
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o nome completo"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Data de nascimento *</Text>
            <TextInput
              value={formData.dataNascimento}
              onChangeText={(value) => handleChange('dataNascimento', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Sexo *</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => handleChange('sexo', 'masculino')}
                className={`flex-1 p-3 rounded-lg border ${
                  formData.sexo === 'masculino'
                    ? 'bg-amber-600 border-amber-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <Text
                  className={`text-center ${
                    formData.sexo === 'masculino'
                      ? 'text-white'
                      : 'text-gray-300'
                  }`}
                >
                  Masculino
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChange('sexo', 'feminino')}
                className={`flex-1 p-3 rounded-lg border ${
                  formData.sexo === 'feminino'
                    ? 'bg-amber-600 border-amber-500'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <Text
                  className={`text-center ${
                    formData.sexo === 'feminino'
                      ? 'text-white'
                      : 'text-gray-300'
                  }`}
                >
                  Feminino
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Etnia *</Text>
            <TextInput
              value={formData.etnia}
              onChangeText={(value) => handleChange('etnia', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite a etnia"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Endereço *</Text>
            <TextInput
              value={formData.endereco}
              onChangeText={(value) => handleChange('endereco', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o endereço completo"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={2}
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">CPF *</Text>
            <TextInput
              value={formData.cpf}
              onChangeText={(value) => handleChange('cpf', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o CPF"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">NIC *</Text>
            <TextInput
              value={formData.nic}
              onChangeText={(value) => handleChange('nic', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o NIC"
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        <View className="flex-row gap-4 mt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <Text className="text-center text-gray-300">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={saving}
            className="flex-1 p-4 bg-amber-600 rounded-lg"
          >
            <Text className="text-center text-white">
              {saving ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 