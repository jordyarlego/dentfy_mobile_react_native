import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Usuario } from '../../types/usuario';

interface ModalVisualizacaoUsuarioProps {
  visible: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (_id: string) => void;
}

export default function ModalVisualizacaoUsuario({
  visible,
  usuario,
  onClose,
  onEdit,
  onDelete,
}: ModalVisualizacaoUsuarioProps) {
  if (!usuario) return null; // Não renderiza se não houver usuário

  const handleDelete = () => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o usuário ${usuario.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onDelete(usuario._id) },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View className="bg-gray-800 border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-sm md:max-w-md lg:max-w-lg">

          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-amber-500/30">
            <View className="flex-row items-center gap-2">
              {/* Ícone de logo placeholder */}
              <View className="w-8 h-8 bg-amber-600 rounded-full items-center justify-center">
                 <Ionicons name="person" size={20} color="#0E1A26" />
              </View>
              <Text className="text-xl font-bold text-amber-100">
                Detalhes do Usuário
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Conteúdo */}
          <ScrollView className="p-4 max-h-[70vh]"> {/* Limitar altura para Scroll */}
            <View className="space-y-4">
              {/* ID */}
              <View>
                 <Text className="text-sm font-medium mb-1 text-amber-500">ID</Text>
                 <Text className="text-gray-100">{usuario._id}</Text>
              </View>
              {/* Nome */}
              <View>
                <Text className="text-sm font-medium mb-1 text-amber-500">
                  <Ionicons name="person-outline" size={14} color="#F59E0B" /> Nome Completo
                </Text>
                <Text className="text-gray-100">{usuario.name}</Text>
              </View>

              {/* Email */}
              <View>
                <Text className="text-sm font-medium mb-1 text-amber-500">
                   <Ionicons name="mail-outline" size={14} color="#F59E0B" /> E-mail
                </Text>
                <Text className="text-gray-100">{usuario.email}</Text>
              </View>
              
              {/* CPF */}
              <View>
                <Text className="text-sm font-medium mb-1 text-amber-500">
                   <Ionicons name="card-outline" size={14} color="#F59E0B" /> CPF
                </Text>
                <Text className="text-gray-100">{usuario.cpf}</Text>
              </View>

               {/* Cargo */}
              <View>
                <Text className="text-sm font-medium mb-1 text-amber-500">
                   <Ionicons name="person-circle-outline" size={14} color="#F59E0B" /> Cargo
                </Text>
                <Text className="text-gray-100">{usuario.role}</Text>
              </View>

                {/* Status (opcional, se precisar exibir) */}
              {/* <View>
                <Text className="text-sm font-medium mb-1 text-amber-500">
                   <Ionicons name="checkmark-circle-outline" size={14} color="#F59E0B" /> Status
                </Text>
                <Text className="text-gray-100">{usuario.status}</Text>
              </View> */}

            </View>
          </ScrollView>

          {/* Botões de Ação */}
          <View className="flex-row justify-end gap-3 p-4 border-t border-amber-500/30">
            <TouchableOpacity
              onPress={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-600/20 border border-red-600 text-red-400"
            >
              <Text className="text-red-400 font-medium">Excluir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onEdit(usuario)}
              className="px-4 py-2 rounded-lg bg-amber-600"
            >
              <Text className="text-[#0E1A26] font-medium">Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 