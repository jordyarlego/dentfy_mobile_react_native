import React from 'react';
import { View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Evidencia } from '../../types/caso';

interface ModalDetalhesEvidenciaProps {
  visible: boolean;
  onClose: () => void;
  evidencia: Evidencia;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ModalDetalhesEvidencia({
  visible,
  onClose,
  evidencia,
  onEdit,
  onDelete,
}: ModalDetalhesEvidenciaProps) {
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
              Detalhes da Evidência
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Título</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{evidencia.titulo}</Text>
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Descrição</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{evidencia.descricao}</Text>
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Tipo</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>
                {evidencia.tipo === 'imagem' ? 'Imagem' : 'Documento'}
              </Text>
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Coletado por</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{evidencia.coletadoPor}</Text>
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Data de coleta</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{evidencia.dataColeta}</Text>
            </View>

            <View>
              <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 4 }}>Local</Text>
              <Text style={{ fontSize: 18, color: '#FFFFFF' }}>{evidencia.local}</Text>
            </View>
          </ScrollView>

          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onDelete}
              className="flex-1 p-4 bg-red-600 rounded-lg"
            >
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              className="flex-1 p-4 bg-amber-600 rounded-lg"
            >
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 