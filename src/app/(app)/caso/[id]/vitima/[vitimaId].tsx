import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Body } from '@/components/Typography';
import { colors } from '@/theme/colors';
import type { Vitima, Caso } from '@/types/caso';
import { STORAGE_KEYS } from '@/types/caso';

type Sexo = 'masculino' | 'feminino' | 'outro';
type Etnia = 'branca' | 'preta' | 'parda' | 'amarela' | 'indigena' | 'outro';

export default function EditarVitima() {
  const { id, vitimaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Vitima | null>(null);

  useEffect(() => {
    carregarVitima();
  }, [id, vitimaId]);

  const carregarVitima = async () => {
    try {
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      if (!casosStr) {
        throw new Error('Caso não encontrado');
      }

      const casos = JSON.parse(casosStr) as Caso[];
      const caso = casos.find((c) => String(c._id) === String(id));
      if (!caso) {
        throw new Error('Caso não encontrado');
      }

      const vitima = caso.vitimas.find((v) => String(v._id) === String(vitimaId));
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

  const handleChange = (field: keyof Vitima, value: string) => {
    if (!formData) return;
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setSaving(true);

      // Validar campos obrigatórios
      const camposObrigatorios: (keyof Omit<Vitima, '_id'>)[] = [
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

      const casos = JSON.parse(casosStr) as Caso[];
      const casoIndex = casos.findIndex((c) => String(c._id) === String(id));
      if (casoIndex === -1) {
        throw new Error('Caso não encontrado');
      }

      // Atualizar vítima
      const vitimaIndex = casos[casoIndex].vitimas.findIndex(
        (v) => String(v._id) === String(vitimaId)
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
      <View className="flex-1 items-center justify-center bg-dentfyGray900">
        <Body className="text-dentfyTextSecondary">Carregando...</Body>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-dentfyGray900">
      <View className="p-4">
        <View className="mb-6">
          <Body className="text-2xl font-bold text-dentfyAmber mb-2">
            Editar Vítima
          </Body>
          <Body className="text-base text-dentfyTextSecondary">
            Atualize os dados da vítima abaixo.
          </Body>
        </View>

        <View className="space-y-4">
          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Nome *</Body>
            <TextInput
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="Digite o nome completo"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Data de nascimento *</Body>
            <TextInput
              value={formData.dataNascimento}
              onChangeText={(value) => handleChange('dataNascimento', value)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Sexo *</Body>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => handleChange('sexo', 'masculino')}
                className={`flex-1 p-3 rounded-lg border ${
                  formData.sexo === 'masculino'
                    ? 'bg-dentfyAmber border-amber-500'
                    : 'bg-dentfyGray800 border-dentfyGray700'
                }`}
              >
                <Body
                  className={`text-center ${
                    formData.sexo === 'masculino'
                      ? 'text-white'
                      : 'text-dentfyTextSecondary'
                  }`}
                >
                  Masculino
                </Body>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleChange('sexo', 'feminino')}
                className={`flex-1 p-3 rounded-lg border ${
                  formData.sexo === 'feminino'
                    ? 'bg-dentfyAmber border-amber-500'
                    : 'bg-dentfyGray800 border-dentfyGray700'
                }`}
              >
                <Body
                  className={`text-center ${
                    formData.sexo === 'feminino'
                      ? 'text-white'
                      : 'text-dentfyTextSecondary'
                  }`}
                >
                  Feminino
                </Body>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Etnia *</Body>
            <TextInput
              value={formData.etnia}
              onChangeText={(value) => handleChange('etnia', value as Etnia)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="Digite a etnia"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Endereço *</Body>
            <TextInput
              value={formData.endereco}
              onChangeText={(value) => handleChange('endereco', value)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="Digite o endereço completo"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={2}
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">CPF *</Body>
            <TextInput
              value={formData.cpf}
              onChangeText={(value) => handleChange('cpf', value.replace(/\D/g, ''))}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="Digite o CPF"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">NIC *</Body>
            <TextInput
              value={formData.nic}
              onChangeText={(value) => handleChange('nic', value)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="Digite o NIC"
              placeholderTextColor="#6B7280"
            />
          </View>
        </View>

        <View className="flex-row gap-4 mt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-4 bg-dentfyGray800 rounded-lg border border-dentfyGray700"
          >
            <Body className="text-center text-dentfyTextSecondary">Cancelar</Body>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={saving}
            className="flex-1 p-4 bg-dentfyAmber rounded-lg"
          >
            <Body className="text-center text-white">
              {saving ? 'Salvando...' : 'Salvar'}
            </Body>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
} 