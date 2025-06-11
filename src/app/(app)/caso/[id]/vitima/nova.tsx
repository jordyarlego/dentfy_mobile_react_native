import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Body } from '../../../../../components/Typography';
import { colors } from '../../../../../theme/colors';
import HeaderPerito from '../../../../../components/header';
import { useToast } from '../../../../../contexts/ToastContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { criarVitima } from '../../../../../services/api_vitima';
import type { Vitima } from '../../../../../types/caso';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
} as const;

type Etnia = 'Branca' | 'Preta' | 'Parda' | 'Amarela' | 'Indígena' | 'Outro';
type Sexo = 'Masculino' | 'Feminino' | 'Outro';

interface VitimaFormState {
  nome: string;
  cpf: string;
  dataNascimento: Date;
  sexo: Sexo;
  endereco: string;
  etnia: Etnia;
}

export default function NovaVitima() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState<VitimaFormState>({
    nome: '',
    cpf: '',
    dataNascimento: new Date(),
    sexo: 'outro',
    endereco: '',
    etnia: 'outro',
  });

  const handleChange = (field: keyof VitimaFormState, value: string | Date) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('dataNascimento', selectedDate);
    }
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);
    setIsSaved(false);

    // Validações básicas
    if (!formData.nome.trim()) {
      showToast('Nome é obrigatório', 'error');
      setLoading(false);
      return;
    }

    if (!formData.cpf.trim()) {
      showToast('CPF é obrigatório', 'error');
      setLoading(false);
      return;
    }

    if (formData.cpf.replace(/\D/g, '').length !== 11) {
      showToast('CPF deve ter 11 dígitos', 'error');
      setLoading(false);
      return;
    }

    // Montar objeto para enviar ao backend
    const dadosParaEnvio = {
      nomeCompleto: formData.nome,
      cpf: formData.cpf,
      dataNascimento: formData.dataNascimento.toISOString(),
      sexo: formData.sexo.charAt(0).toUpperCase() + formData.sexo.slice(1), // 'Masculino', 'Feminino' ou 'Outro'
      endereco: formData.endereco,
      etnia: formData.etnia.charAt(0).toUpperCase() + formData.etnia.slice(1), // 'Branca', 'Preta', etc
      caso: id, // ID do caso, vindo do useLocalSearchParams
    };

    console.log('Enviando dados para criar vítima:', dadosParaEnvio);

    // Chamar API para criar vítima
    await criarVitima(dadosParaEnvio);

    setIsSaved(true);
    showToast('Vítima salva com sucesso!', 'success');

    // Aguardar um pouco para mostrar o feedback visual
    await new Promise(res => setTimeout(res, 1000));

    router.back();
  } catch (error: any) {
    console.error('Erro ao adicionar vítima:', error);
    showToast(error.message || 'Erro ao adicionar vítima', 'error');
  } finally {
    setLoading(false);
  }
};
  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />

      {/* Modal de Feedback */}
      <Modal
        visible={loading}
        transparent
        animationType="fade"
      >
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

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Body className="text-2xl font-bold text-amber-500 mb-2">
            Nova Vítima
          </Body>
          <Body className="text-base text-gray-300">
            Preencha os dados da vítima abaixo.
          </Body>
        </View>

        <View className="space-y-4">
          <View>
            <Body className="text-base text-gray-300 mb-1">Nome *</Body>
            <TextInput
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o nome completo"
              placeholderTextColor="#6B7280"
              editable={!loading}
            />
          </View>

          <View>
            <Body className="text-base text-gray-300 mb-1">Data de Nascimento *</Body>
            <TouchableOpacity
              onPress={() => !loading && setShowDatePicker(true)}
              className={`bg-gray-800 p-3 rounded-lg border border-gray-700 ${loading ? 'opacity-50' : ''}`}
              disabled={loading}
            >
              <Body className="text-white">
                {formData.dataNascimento.toLocaleDateString('pt-BR')}
              </Body>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.dataNascimento}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View>
            <Body className="text-base text-gray-300 mb-1">Sexo *</Body>
            <View className={`bg-gray-800 rounded-lg border border-gray-700 ${loading ? 'opacity-50' : ''}`}>
              <Picker
                selectedValue={formData.sexo}
                onValueChange={(value) => handleChange('sexo', value)}
                style={{ color: 'white' }}
                dropdownIconColor="white"
                enabled={!loading}
              >
                <Picker.Item label="Masculino" value="masculino" />
                <Picker.Item label="Feminino" value="feminino" />
                <Picker.Item label="Outro" value="outro" />
              </Picker>
            </View>
          </View>

          <View>
            <Body className="text-base text-gray-300 mb-1">Endereço</Body>
            <TextInput
              value={formData.endereco}
              onChangeText={(value) => handleChange('endereco', value)}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o endereço completo"
              placeholderTextColor="#6B7280"
              editable={!loading}
            />
          </View>

          <View>
            <Body className="text-base text-gray-300 mb-1">Etnia *</Body>
            <View className={`bg-gray-800 rounded-lg border border-gray-700 ${loading ? 'opacity-50' : ''}`}>
              <Picker
                selectedValue={formData.etnia}
                onValueChange={(value) => handleChange('etnia', value)}
                style={{ color: 'white' }}
                dropdownIconColor="white"
                enabled={!loading}
              >
                <Picker.Item label="Branca" value="Branco" />
                <Picker.Item label="Preta" value="Preto" />
                <Picker.Item label="Parda" value="Pardo" />
                <Picker.Item label="Amarela" value="Amarelo" />
                <Picker.Item label="Indígena" value="Indígena" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>
          </View>

          <View>
            <Body className="text-base text-gray-300 mb-1">CPF *</Body>
            <TextInput
              value={formData.cpf}
              onChangeText={(value) => handleChange('cpf', value.replace(/\D/g, ''))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o CPF"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              maxLength={11}
              editable={!loading}
            />
          </View>
        </View>

        <View className="flex-row gap-4 mt-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700"
          >
            <Body className="text-center text-gray-300">Cancelar</Body>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 p-4 bg-amber-600 rounded-lg"
          >
            <Body className="text-center text-white">Salvar</Body>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
} 