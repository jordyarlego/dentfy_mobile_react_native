import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { Vitima } from '../../types/caso';

export interface ListaVitimasProps {
  vitimas?: Vitima[];
  onAdd?: () => void;
  onEdit?: (vitima: Vitima) => void;
  onDelete?: (vitima: Vitima) => void;
}

export default function ListaVitimas({ vitimas = [], onAdd, onEdit, onDelete }: ListaVitimasProps) {
  // Garante que vitimas seja sempre um array
  const vitimasArray = Array.isArray(vitimas) ? vitimas : [];

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Heading size="medium" className="text-dentfyAmber">
          Vítimas
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
      
      {vitimasArray.length === 0 ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg">
          <Body className="text-dentfyTextPrimary text-center">
            Nenhuma vítima registrada
          </Body>
        </View>
      ) : (
        <View className="space-y-2">
          {vitimasArray.map((vitima) => {
            const idade = new Date().getFullYear() - new Date(vitima.dataNascimento).getFullYear();
            return (
              <View key={vitima._id} className="bg-dentfyGray800/30 p-4 rounded-lg">
                <Body className="text-dentfyTextPrimary">
                  {vitima.nome} - {idade} anos
                </Body>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}