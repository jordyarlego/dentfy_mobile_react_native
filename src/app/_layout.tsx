import "../theme/global.css";
import { Stack } from 'expo-router';
import { ToastProvider } from '../contexts/ToastContext';
import { useCustomFonts } from '../assets/fonts';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Body } from '../components/Typography';
import { colors } from '../theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../hooks/useAuth';

// Função para verificar se o usuário está autenticado
async function isAuthenticated() {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
}

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      const inAuthGroup = segments[0] === '(auth)';

      console.log('=== VERIFICAÇÃO DE AUTENTICAÇÃO ===');
      console.log('Autenticado:', authenticated);
      console.log('Grupo atual:', segments[0]);
      console.log('Em grupo de auth:', inAuthGroup);

      if (!authenticated && !inAuthGroup) {
        // Se não está autenticado e não está na tela de login, redireciona para login
        console.log('Redirecionando para login...');
        router.replace('/login');
      } else if (authenticated && inAuthGroup) {
        // Se está autenticado e está na tela de login, redireciona para casos
        console.log('Redirecionando para casos...');
        router.replace('/(app)/casos');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaProvider>
        <ToastProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dentfyDarkBlue }}>
            <Body style={{ color: colors.dentfyTextPrimary }}>Carregando...</Body>
          </View>
        </ToastProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}