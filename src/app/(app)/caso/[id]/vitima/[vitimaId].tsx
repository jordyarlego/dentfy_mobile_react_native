import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Body } from '@/components/Typography';
import { colors } from '@/theme/colors';
import type { Vitima } from '@/services/api_vitima'; // supondo que você tenha exportado lá
import {
  buscarVitimaPorId,
  atualizarVitima,
} from '@/services/api_vitima';

type Sexo = 'Masculino' | 'Feminino' | 'Outro';
type Etnia = 'Preto' | 'Pardo' | 'Branco' | 'Amarelo' | 'Indígena';

export default function EditarVitima() {
  const { vitimaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Vitima | null>(null);

  useEffect(() => {
    if (typeof vitimaId === 'string') {
      carregarVitima(vitimaId);
    }
  }, [vitimaId]);

  const carregarVitima = async (id: string) => {
    try {
      setLoading(true);
      const vitima = await buscarVitimaPorId(id);
      setFormData(vitima);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar vítima', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Vitima, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async () => {
    if (!formData || !vitimaId) return;

    // Validar campos obrigatórios
    const camposObrigatorios: (keyof Omit<Vitima, '_id' | 'criadoEm' | 'odontograma' | 'caso'>)[] = [
      'nomeCompleto',
      'dataNascimento',
      'sexo',
      'etnia',
      'endereco',
      'cpf',
      'nic',
    ];

    const camposFaltantes = camposObrigatorios.filter(
      campo => !formData[campo] || formData[campo]?.toString().trim() === ''
    );

    if (camposFaltantes.length > 0) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    try {
      setSaving(true);
      // Montar dados para atualizar (remover _id, criadoEm, odontograma, caso)
      const {
        _id, criadoEm, odontograma, caso, ...dadosAtualizar
      } = formData;

      await atualizarVitima(vitimaId, dadosAtualizar);
      Alert.alert('Sucesso', 'Vítima atualizada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
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
            <Body className="text-base text-dentfyTextSecondary mb-1">Nome Completo *</Body>
            <TextInput
              value={formData.nomeCompleto}
              onChangeText={value => handleChange('nomeCompleto', value)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="Digite o nome completo"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Data de nascimento *</Body>
            <TextInput
              value={formData.dataNascimento}
              onChangeText={value => handleChange('dataNascimento', value)}
              className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Sexo *</Body>
            <View className="flex-row gap-4">
              {['Masculino', 'Feminino', 'Outro'].map((sexo) => (
                <TouchableOpacity
                  key={sexo}
                  onPress={() => handleChange('sexo', sexo as Sexo)}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.sexo === sexo
                      ? 'bg-dentfyAmber border-amber-500'
                      : 'bg-dentfyGray800 border-dentfyGray700'
                  }`}
                >
                  <Body
                    className={`text-center ${
                      formData.sexo === sexo ? 'text-white' : 'text-dentfyTextSecondary'
                    }`}
                  >
                    {sexo}
                  </Body>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Etnia *</Body>
            <View className="flex-row flex-wrap gap-2">
              {['Preto', 'Pardo', 'Branco', 'Amarelo', 'Indígena'].map((etnia) => (
                <TouchableOpacity
                  key={etnia}
                  onPress={() => handleChange('etnia', etnia as Etnia)}
                  className={`px-4 py-2 rounded-lg border ${
                    formData.etnia === etnia
                      ? 'bg-dentfyAmber border-amber-500'
                      : 'bg-dentfyGray800 border-dentfyGray700'
                  }`}
                >
                  <Body
                    className={`text-center ${
                      formData.etnia === etnia ? 'text-white' : 'text-dentfyTextSecondary'
                    }`}
                  >
                    {etnia}
                  </Body>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View>
            <Body className="text-base text-dentfyTextSecondary mb-1">Endereço *</Body>
            <TextInput
              value={formData.endereco}
              onChangeText={value => handleChange('endereco', value)}
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
              onChangeText={value => handleChange('cpf', value.replace(/\D/g, ''))}
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
              onChangeText={value => handleChange('nic', value)}
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
