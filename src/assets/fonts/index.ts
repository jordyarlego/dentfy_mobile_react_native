import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Mantenha a tela de splash visível enquanto carregamos as fontes
SplashScreen.preventAutoHideAsync();

export const useCustomFonts = () => {
  const [fontsLoaded, error] = useFonts({
    'Roboto-Regular': require('./Roboto-Regular.ttf'),
    'Roboto-Medium': require('./Roboto-Medium.ttf'),
    'Roboto-Bold': require('./Roboto-Bold.ttf'),
  });

  if (error) {
    console.error('Erro ao carregar fontes:', error);
  }

  if (fontsLoaded) {
    // Esconda a tela de splash quando as fontes estiverem carregadas
    SplashScreen.hideAsync();
  }

  return fontsLoaded;
}; 