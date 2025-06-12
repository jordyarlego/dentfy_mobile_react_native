'use client';

import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import ModalConfirmacao from './caso/ModalConfirmacao';
import { colors } from '../theme/colors';
import { Body } from './Typography';

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
  const { signOut } = useAuth();
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const handleLogout = async () => {
    setModalLogoutVisible(true);
  };

  const confirmarLogout = async () => {
    try {
      console.log('=== INÍCIO DO LOGOUT ===');
      await signOut();
      console.log('Logout realizado, redirecionando...');
      router.replace('/login');
      setModalLogoutVisible(false);
      console.log('=== FIM DO LOGOUT ===');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, tenta redirecionar
      router.replace('/login');
    }
  };

  return (
    <View
      className="flex-row justify-around items-center bg-dentfyGray800/80 border-t border-dentfyBorderGray px-4 py-3"
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
            className="flex-1 items-center py-1"
          >
            <Ionicons 
              name={isActive ? item.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap : item.icon}
              size={24}
              color={isActive ? colors.dentfyAmber : colors.dentfyTextSecondary}
            />
            <Body
              size="small"
              className={`mt-1 ${
                isActive ? 'text-dentfyAmber font-medium' : 'text-dentfyTextSecondary'
              }`}
            >
              {item.name}
            </Body>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={handleLogout}
        className="flex-1 items-center py-1"
      >
        <Ionicons 
          name="log-out-outline" 
          size={24} 
          color={colors.errorRed} 
        />
        <Body
          size="small"
          className="mt-1 text-errorRed"
        >
          Sair
        </Body>
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