import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vitima } from '../../types/caso';

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
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F59E0B' }}>
          Vítimas
        </Text>
        <TouchableOpacity
          onPress={onAdd}
          className="flex-row items-center gap-2 px-4 py-2 bg-amber-600 rounded-lg"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>Nova Vítima</Text>
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
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#F3F4F6' }}>
                  {vitima.nome}
                </Text>
                <Text style={{ fontSize: 14, color: '#9CA3AF' }}>
                  {new Date(vitima.dataNascimento).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => onEdit(vitima)}
                  className="p-2"
                >
                  <Ionicons name="pencil" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(vitima)}
                  className="p-2"
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {vitima.sexo === 'masculino' ? 'Masculino' : 'Feminino'}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {vitima.etnia}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {vitima.cpf}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {vitima.nic}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: 14, color: '#D1D5DB', marginTop: 8 }}>
              {vitima.endereco}
            </Text>
          </View>
        ))}

        {vitimas.length === 0 && (
          <View className="items-center justify-center py-8">
            <Ionicons name="person" size={48} color="#6B7280" />
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginTop: 8 }}>
              Nenhuma vítima cadastrada
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 