import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vitima } from '../../types/caso';
import { colors } from '../../theme/colors';

interface ListaVitimasProps {
  vitimas: Vitima[];
  onAdd: () => void;
  onEdit: (vitima: Vitima) => void;
  onDelete: (vitima: Vitima) => void;
}

export default function ListaVitimas({
  vitimas,
  onAdd,
  onEdit,
  onDelete,
}: ListaVitimasProps) {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ color: colors.dentfyAmber }} className="text-xl font-bold">
          Vítimas
        </Text>
        <TouchableOpacity
          onPress={onAdd}
          className="flex-row items-center gap-2 px-4 py-2 bg-amber-600 rounded-lg"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" /> 
          <Text style={{ color: '#FFFFFF' }} className="text-base">
            Nova Vítima
          </Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-4">
        {vitimas.map((vitima) => (
          <View
            key={vitima._id}
            className="bg-gray-800/30 p-4 rounded-lg border border-gray-700"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text style={{ color: colors.dentfyTextPrimary }} className="text-base font-medium">
                  {vitima.nome}
                </Text>
                <Text style={{ color: colors.dentfyTextSecondary }} className="text-sm">
                  {new Date(vitima.dataNascimento).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => onEdit(vitima)}
                  className="p-2"
                >
                  <Ionicons name="pencil" size={20} color={colors.dentfyTextSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(vitima)}
                  className="p-2"
                >
                  <Ionicons name="trash" size={20} color={colors.errorRed} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ color: colors.dentfyTextSecondary }} className="text-xs">
                  {vitima.sexo === 'masculino' ? 'Masculino' : 'Feminino'}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ color: colors.dentfyTextSecondary }} className="text-xs">
                  {vitima.etnia}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ color: colors.dentfyTextSecondary }} className="text-xs">
                  {vitima.cpf}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ color: colors.dentfyTextSecondary }} className="text-xs">
                  {vitima.nic}
                </Text>
              </View>
            </View>

            <Text style={{ color: colors.dentfyTextSecondary, marginTop: 8 }} className="text-sm">
              {vitima.endereco}
            </Text>
          </View>
        ))}

        {vitimas.length === 0 && (
          <View className="items-center justify-center py-8">
            <Ionicons name="person" size={48} color={colors.dentfyGray750} />
            <Text style={{ color: colors.dentfyTextSecondary, marginTop: 8 }} className="text-base">
              Nenhuma vítima cadastrada
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}