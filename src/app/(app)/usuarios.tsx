'use client';

import React from 'react';
import { View, Text } from 'react-native';
import HeaderPerito from '../../components/header';
import TabelaUsuarios from '../../components/usuario/TabelaUsuarios';

export default function Usuarios() {
  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito />
      
      <View className="flex-1 p-4">
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 16 }}>
          Gerenciamento de Usuários
        </Text>
        <TabelaUsuarios />
      </View>
    </View>
  );
} 