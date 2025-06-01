import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Vitima } from '../../../../../types/caso';

const STORAGE_KEYS = {
  CASOS: 'casos',
};

export default function NovaVitima() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<Vitima, '_id'>>({
    nome: '',
    dataNascimento: '',
    sexo: 'masculino',
    etnia: '',
    endereco: '',
    cpf: '',
    nic: '',
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validar campos obrigatórios
      const camposObrigatorios: (keyof typeof formData)[] = [
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

      // Criar nova vítima
      const novaVitima: Vitima = {
        _id: Date.now().toString(),
        ...formData,
      };

      // Atualizar caso
      const casoAtualizado = {
        ...casos[casoIndex],
        vitimas: [...casos[casoIndex].vitimas, novaVitima],
      };

      casos[casoIndex] = casoAtualizado;
      await AsyncStorage.setItem(STORAGE_KEYS.CASOS, JSON.stringify(casos));

      Alert.alert('Sucesso', 'Vítima cadastrada com sucesso!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao cadastrar vítima');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-900">
      <View className="p-4">
        <View className="mb-6">
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 8 }}>
            Nova Vítima
          </Text>
          <Text style={{ fontSize: 16, color: '#D1D5DB' }}>
            Preencha os dados da vítima abaixo.
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>Nome completo *</Text>
            <TextInput
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o nome completo"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>Data de nascimento *</Text>
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
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>Sexo *</Text>
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
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>Etnia *</Text>
            <TextInput
              value={formData.etnia}
              onChangeText={(value) => handleChange('etnia', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite a etnia"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>Endereço *</Text>
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
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>CPF *</Text>
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
            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 1 }}>NIC *</Text>
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
            <Text style={{ fontSize: 16, color: '#D1D5DB', textAlign: 'center' }}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="flex-1 p-4 bg-amber-600 rounded-lg"
          >
            <Text style={{ fontSize: 16, color: '#FFFFFF', textAlign: 'center' }}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 