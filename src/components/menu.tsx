'use client';

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalConfirmacao from './caso/ModalConfirmacao';

interface MenuItem {
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: 'bar-chart-outline', path: '/dashboard' },
  { name: 'Casos', icon: 'folder-outline', path: '/casos' },
  { name: 'Usuários', icon: 'people-outline', path: '/usuarios' },
];

export default function Menu() {
  const router = useRouter();
  const pathname = usePathname();
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const handleLogout = async () => {
    setModalLogoutVisible(true);
  };

  const confirmarLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login');
    setModalLogoutVisible(false);
  };

  return (
    <View
      className="flex-row justify-around items-center bg-gray-800/80 border-t border-gray-700 px-4 py-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      }}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => router.navigate(item.path)}
            className={
              `flex-1 items-center py-1 rounded-md ${
                isActive ? '' : ''
              }`
            }
          >
            <Ionicons 
              name={isActive ? item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon}
              size={24}
              color={isActive ? '#F59E0B' : '#9CA3AF'}
            />
            <Text
              className={`text-xs mt-1 ${
                isActive ? 'text-amber-500 font-bold' : 'text-gray-400'
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-1 items-center py-1 rounded-md"
      >
        <Ionicons name="log-out-outline" size={24} color="#EF4444" />
        <Text className="text-xs mt-1 text-red-500">Sair</Text>
      </TouchableOpacity>

      <ModalConfirmacao
        visible={modalLogoutVisible}
        onClose={() => setModalLogoutVisible(false)}
        onConfirm={confirmarLogout}
        titulo="Sair do Aplicativo"
        mensagem="Tem certeza que deseja sair?"
        textoConfirmacao="Sair"
        textoCancelamento="Cancelar"
      />
    </View>
  );
}