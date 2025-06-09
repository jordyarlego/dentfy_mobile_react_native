import React from 'react';
import { View, Modal, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalConfirmacaoProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  mensagem: string;
  textoConfirmacao?: string;
  textoCancelamento?: string;
}

export default function ModalConfirmacao({
  visible,
  onClose,
  onConfirm,
  titulo,
  mensagem,
  textoConfirmacao = 'Confirmar',
  textoCancelamento = 'Cancelar',
}: ModalConfirmacaoProps) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F59E0B' }}>
              {titulo}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 6 }}>
            {mensagem}
          </Text>

          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <Text style={{ textAlign: 'center', color: '#D1D5DB' }}>
                {textoCancelamento}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 p-4 bg-amber-600 rounded-lg"
            >
              <Text style={{ textAlign: 'center', color: '#FFFFFF' }}>
                {textoConfirmacao}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 