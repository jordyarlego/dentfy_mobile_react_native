import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { Perito } from '../../types/caso';

export interface ListaPeritosProps {
  peritos: Perito[];
  onAdd?: () => void;
  onEdit?: (perito: Perito) => void;
  onDelete?: (perito: Perito) => void;
}

export default function ListaPeritos({ peritos, onAdd, onEdit, onDelete }: ListaPeritosProps) {
  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Heading size="medium" className="text-dentfyAmber">
          Peritos
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
      
      {peritos.length === 0 ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg">
          <Body className="text-dentfyTextPrimary text-center">
            Nenhum perito designado
          </Body>
        </View>
      ) : (
        <View className="space-y-2">
          {peritos.map((perito) => (
            <View key={perito._id} className="bg-dentfyGray800/30 p-4 rounded-lg">
              <Body className="text-dentfyTextPrimary">
                {perito.nome} - {perito.especialidade}
              </Body>
            </View>
          ))}
        </View>
      )}
    </View>
  );
} 