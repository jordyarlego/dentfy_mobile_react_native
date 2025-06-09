'use client';

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HeaderProps {
  showBackButton?: boolean;
}

interface UserInfo {
  nome: string;
  cargo: string;
}

export default function HeaderPerito({ showBackButton = false }: HeaderProps) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('@dentfy:usuario');
        if (userData) {
          setUserInfo(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
      }
    };

    loadUserInfo();
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView edges={['top']} className="bg-dentfyDarkBlue">
      <View className="bg-dentfyDarkBlue border-b border-dentfyCyan/30 min-h-[64px]">
        <View className="flex-row items-center justify-between px-6 py-3">
          <View className="flex-row items-center gap-4">
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-2"
              >
                <Text className="text-dentfyAmber text-2xl">←</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View className="w-8 h-8">
                  <Image
                    source={require('../assets/logo.png')}
                    style={{ width: 25, height: 30 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="gap-0.5">
                  <Text className="text-dentfyTextPrimary text-2xl font-bold">
                    Denti<Text className="text-dentfyAmber">Fy</Text>
                  </Text>
                  <Text className="text-dentfyTextSecondary text-sm">
                    Identificação Criminal
                  </Text>
                </View>
              </>
            )}
          </View>

          {userInfo && (
            <View className="flex-row items-center gap-4">
              <View className="items-end">
                <Text className="text-dentfyTextPrimary font-medium text-base">
                  {userInfo.nome}
                </Text>
                <Text className="text-dentfyTextSecondary text-sm">
                  {userInfo.cargo}
                </Text>
              </View>
              <View className="w-11 h-11 rounded-full bg-dentfyAmber items-center justify-center">
                <Text className="text-dentfyDarkBlue font-bold text-lg">
                  {getInitials(userInfo.nome)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}