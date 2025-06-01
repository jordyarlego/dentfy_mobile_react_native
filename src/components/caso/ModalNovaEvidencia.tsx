import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, Text, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Evidencia } from '../../types/caso';

interface ModalNovaEvidenciaProps {
  visible: boolean;
  onClose: () => void;
  onSave: (evidencia: Omit<Evidencia, '_id'>) => void;
}

export default function ModalNovaEvidencia({ visible, onClose, onSave }: ModalNovaEvidenciaProps) {
  const [formData, setFormData] = useState<Omit<Evidencia, '_id'>>({
    titulo: '',
    descricao: '',
    tipo: 'imagem',
    coletadoPor: '',
    dataColeta: '',
    local: '',
  });

  const handleChange = (field: keyof Omit<Evidencia, '_id'>, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validar campos obrigatórios
    const camposObrigatorios: (keyof Omit<Evidencia, '_id'>)[] = [
      'titulo',
      'descricao',
      'tipo',
      'coletadoPor',
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

    onSave(formData);
    setFormData({
      titulo: '',
      descricao: '',
      tipo: 'imagem',
      coletadoPor: '',
      dataColeta: '',
      local: '',
    });
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
              Nova Evidência
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#D1D5DB" />
            </TouchableOpacity>
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
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Coletado por *</Text>
              <TextInput
                value={formData.coletadoPor}
                onChangeText={(value) => handleChange('coletadoPor', value)}
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