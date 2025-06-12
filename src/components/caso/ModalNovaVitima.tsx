import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vitima } from '../../types/caso';
import { colors } from '../../theme/colors'; // Corrigido para caminho relativo

interface ModalNovaVitimaProps {
  visible: boolean;
  onClose: () => void;
  onSave: (vitima: Omit<Vitima, '_id'>) => void;
}

export default function ModalNovaVitima({ visible, onClose, onSave }: ModalNovaVitimaProps) {
  const [formData, setFormData] = useState<Omit<Vitima, '_id'>>({
    nome: '',
    dataNascimento: '',
    sexo: 'masculino',
    etnia: '',
    endereco: '',
    cpf: '',
  });

  const handleChange = (field: keyof Omit<Vitima, '_id'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validar campos obrigatórios
    const camposObrigatorios: (keyof Omit<Vitima, '_id'>)[] = [
      'nome',
      'dataNascimento',
      'sexo',
      'etnia',
      'endereco',
      'cpf',
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

    onSave(formData);
    setFormData({
      nome: '',
      dataNascimento: '',
      sexo: 'masculino',
      etnia: '',
      endereco: '',
      cpf: '',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-overlayBlack justify-end">
        <View className="bg-dentfyGray900 rounded-t-3xl p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-dentfyAmber">
              Nova Vítima
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.dentfyTextSecondary} />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-base text-dentfyTextPrimary mb-1">Nome *</Text>
              <TextInput
                value={formData.nome}
                onChangeText={(value) => handleChange('nome', value)}
                className="bg-dentfyGray800 text-dentfyTextPrimary p-3 rounded-lg border border-dentfyBorderGray"
                placeholder="Digite o nome completo"
                placeholderTextColor={colors.dentfyTextSecondary}
              />
            </View>

            <View>
              <Text className="text-base text-dentfyTextPrimary mb-1">Data de Nascimento *</Text>
              <TextInput
                value={formData.dataNascimento}
                onChangeText={(value) => handleChange('dataNascimento', value)}
                className="bg-dentfyGray800 text-dentfyTextPrimary p-3 rounded-lg border border-dentfyBorderGray"
                placeholder="DD/MM/AAAA"
                placeholderTextColor={colors.dentfyTextSecondary}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-base text-dentfyTextPrimary mb-1">Sexo *</Text>
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => handleChange('sexo', 'masculino')}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.sexo === 'masculino'
                      ? 'bg-dentfyAmber border-dentfyAmber'
                      : 'bg-dentfyGray800 border-dentfyBorderGray'
                  }`}
                >
                  <Text
                    className={`text-center ${
                      formData.sexo === 'masculino' ? 'text-dentfyTextPrimary' : 'text-dentfyTextSecondary'
                    }`}
                  >
                    Masculino
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChange('sexo', 'feminino')}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.sexo === 'feminino'
                      ? 'bg-dentfyAmber border-dentfyAmber'
                      : 'bg-dentfyGray800 border-dentfyBorderGray'
                  }`}
                >
                  <Text
                    className={`text-center ${
                      formData.sexo === 'feminino' ? 'text-dentfyTextPrimary' : 'text-dentfyTextSecondary'
                    }`}
                  >
                    Feminino
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-base text-dentfyTextPrimary mb-1">Etnia *</Text>
              <TextInput
                value={formData.etnia}
                onChangeText={(value) => handleChange('etnia', value)}
                className="bg-dentfyGray800 text-dentfyTextPrimary p-3 rounded-lg border border-dentfyBorderGray"
                placeholder="Digite a etnia"
                placeholderTextColor={colors.dentfyTextSecondary}
              />
            </View>

            <View>
              <Text className="text-base text-dentfyTextPrimary mb-1">Endereço *</Text>
              <TextInput
                value={formData.endereco}
                onChangeText={(value) => handleChange('endereco', value)}
                className="bg-dentfyGray800 text-dentfyTextPrimary p-3 rounded-lg border border-dentfyBorderGray"
                placeholder="Digite o endereço completo"
                placeholderTextColor={colors.dentfyTextSecondary}
                multiline
                numberOfLines={2}
              />
            </View>

            <View>
              <Text className="text-base text-dentfyTextPrimary mb-1">CPF *</Text>
              <TextInput
                value={formData.cpf}
                onChangeText={(value) => handleChange('cpf', value)}
                className="bg-dentfyGray800 text-dentfyTextPrimary p-3 rounded-lg border border-dentfyBorderGray"
                placeholder="Digite o CPF"
                placeholderTextColor={colors.dentfyTextSecondary}
                keyboardType="numeric"
              />
            </View>

          </View>

          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 p-4 bg-dentfyGray800 rounded-lg border border-dentfyBorderGray"
            >
              <Text className="text-center text-dentfyTextSecondary">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 p-4 bg-dentfyAmber rounded-lg"
            >
              <Text className="text-center text-dentfyTextPrimary">Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 