import React, { useState, useEffect } from 'react';
import { View, Modal, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vitima } from '../../types/caso';

interface ModalEditarVitimaProps {
  visible: boolean;
  onClose: () => void;
  vitima: Vitima;
  onSave: (vitima: Vitima) => void;
}

export default function ModalEditarVitima({
  visible,
  onClose,
  vitima,
  onSave,
}: ModalEditarVitimaProps) {
  const [formData, setFormData] = useState<Vitima>(vitima);

  useEffect(() => {
    setFormData(vitima);
  }, [vitima]);

  const handleChange = (field: keyof Vitima, value: string) => {
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

    onSave(formData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-gray-900 rounded-t-3xl p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B' }}>
              Editar Vítima
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Nome *</Text>
              <TextInput
                value={formData.nome}
                onChangeText={(value) => handleChange('nome', value)}
                className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
                placeholder="Digite o nome completo"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Data de Nascimento *</Text>
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
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Sexo *</Text>
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
                    style={{
                      textAlign: 'center',
                      color: formData.sexo === 'masculino' ? '#FFFFFF' : '#D1D5DB',
                    }}
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
                    style={{
                      textAlign: 'center',
                      color: formData.sexo === 'feminino' ? '#FFFFFF' : '#D1D5DB',
                    }}
                  >
                    Feminino
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Etnia *</Text>
              <TextInput
                value={formData.etnia}
                onChangeText={(value) => handleChange('etnia', value)}
                className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
                placeholder="Digite a etnia"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Endereço *</Text>
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
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>CPF *</Text>
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
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>NIC *</Text>
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
              onPress={onClose}
              className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <Text style={{ textAlign: 'center', color: '#D1D5DB' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="flex-1 p-4 bg-amber-600 rounded-lg"
            >
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 