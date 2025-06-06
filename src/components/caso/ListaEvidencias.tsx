import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Evidencia } from '../../types/caso';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';

export interface ListaEvidenciasProps {
  evidencias: Evidencia[];
  onAdd?: () => void;
  onView?: (evidencia: Evidencia) => void;
  onDelete?: (evidencia: Evidencia) => void;
}

export default function ListaEvidencias({
  evidencias,
  onAdd,
  onView,
  onDelete,
}: ListaEvidenciasProps) {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Heading size="medium" className="text-dentfyAmber">
          Evidências
        </Heading>
        {onAdd && (
          <TouchableOpacity
            onPress={onAdd}
            className="p-2 rounded-full bg-dentfyAmber/10"
          >
            <Ionicons name="add" size={24} color={colors.dentfyAmber} />
          </TouchableOpacity>
        )}
      </View>

      <View className="space-y-4">
        {evidencias.map((evidencia) => (
          <View
            key={evidencia._id}
            className="bg-gray-800/30 p-4 rounded-lg border border-gray-700"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#F3F4F6' }}>
                {evidencia.titulo}
              </Text>
              <View className="flex-row gap-2">
                {onView && (
                  <TouchableOpacity
                    onPress={() => onView(evidencia)}
                    className="p-2"
                  >
                    <Ionicons name="eye" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
                {onDelete && (
                  <TouchableOpacity
                    onPress={() => onDelete(evidencia)}
                    className="p-2"
                  >
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {evidencia.tipo === 'imagem' && evidencia.arquivo && (
              <Image
                source={{ uri: evidencia.arquivo }}
                className="w-full h-40 rounded-lg mb-2"
                resizeMode="cover"
              />
            )}

            <Text style={{ fontSize: 16, color: '#D1D5DB', marginBottom: 8 }}>
              {evidencia.descricao}
            </Text>

            <View className="flex-row flex-wrap gap-2">
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {evidencia.coletadoPor}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {new Date(evidencia.dataColeta).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              <View className="bg-gray-700/50 px-2 py-1 rounded">
                <Text style={{ fontSize: 12, color: '#D1D5DB' }}>
                  {evidencia.local}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {evidencias.length === 0 && (
          <View className="items-center justify-center py-8">
            <Ionicons name="document-text" size={48} color="#6B7280" />
            <Text style={{ fontSize: 16, color: '#9CA3AF', marginTop: 8 }}>
              Nenhuma evidência cadastrada
            </Text>
          </View>
        )}
      </View>
    </View>
  );
} 