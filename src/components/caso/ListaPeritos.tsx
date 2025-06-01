import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Perito } from '../../types/caso';

interface ListaPeritosProps {
  peritos: Perito[];
  onAdd: () => void;
  onEdit: (perito: Perito) => void;
  onDelete: (perito: Perito) => void;
}

export default function ListaPeritos({
  peritos,
  onAdd,
  onEdit,
  onDelete,
}: ListaPeritosProps) {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#F59E0B' }}>
          Peritos Envolvidos
        </Text>
        <TouchableOpacity
          onPress={onAdd}
          className="flex-row items-center gap-2 px-4 py-2 bg-amber-600 rounded-lg"
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>Adicionar Perito</Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-4">
        {peritos.map((perito) => (
          <View
            key={perito._id}
            className="bg-gray-800/30 p-4 rounded-lg border border-gray-700"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#F3F4F6' }}>
                  {perito.nome}
                </Text>
                <Text style={{ fontSize: 14, color: '#9CA3AF' }}>
                  {perito.especialidade}
                </Text>
              </View>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => onEdit(perito)}
                  className="p-2"
                >
                  <Ionicons name="pencil" size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onDelete(perito)}
                  className="p-2"
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-2">
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {perito.registro}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {perito.especialidade}
                </Text>
              </View>
              {perito.dataFim && (
                <View className="bg-gray-700/50 px-2 py-1 rounded">
                  <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                    {new Date(perito.dataFim).toLocaleDateString('pt-BR')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {peritos.length === 0 && (
          <View className="items-center justify-center py-8">
            <Ionicons name="people" size={48} color="#6B7280" />
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginTop: 8 }}>
              Nenhum perito cadastrado
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 