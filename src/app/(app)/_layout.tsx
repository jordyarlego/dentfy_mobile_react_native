import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import Menu from '../../components/menu';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../theme/colors';

export default function AppLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" translucent />
      <View className="flex-1 bg-[#0E1A26]">
        <View className="flex-1">
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>
        <SafeAreaView edges={['bottom']} className="bg-transparent">
          <Menu />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}
