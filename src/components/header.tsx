'use client';

import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

interface HeaderProps {
  showBackButton?: boolean;
}

export default function HeaderPerito({ showBackButton = false }: HeaderProps) {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="bg-[#0E1A26]">
      <View className="bg-[#0E1A26] border-b border-cyan-900/30 min-h-[64px]">
        <View className="flex-row items-center justify-between px-6 py-3">
          <View className="flex-row items-center gap-4">
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => router.back()}
                className="p-2"
              >
                <Text className="text-amber-500 text-2xl">←</Text>
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
                  <Text className="text-amber-100 text-2xl font-bold">
                    Denti<Text className="text-amber-500">Fy</Text>
                  </Text>
                  <Text className="text-amber-100/70 text-sm">
                    Identificação Criminal
                  </Text>
                </View>
              </>
            )}
          </View>

          <View className="flex-row items-center gap-4">
            <View className="items-end">
              <Text className="text-amber-100 font-medium text-base">
                Usuário Teste
              </Text>
              <Text className="text-amber-100/70 text-sm">
                Perito
              </Text>
            </View>
            <View className="w-11 h-11 rounded-full bg-amber-600 items-center justify-center">
              <Text className="text-[#0E1A26] font-bold text-lg">
                UT
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}