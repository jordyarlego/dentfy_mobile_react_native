import 'expo-router/entry'; 
import { Slot } from 'expo-router';
import { AuthProvider } from './src/hooks/useAuth'; 
import { useCustomFonts } from './src/assets/fonts';
import { View, Text } from 'react-native';
import { useEffect } from 'react';

export default function App() {
  const fontsLoaded = useCustomFonts();

  useEffect(() => {
    console.log('Fontes carregadas:', fontsLoaded);
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Roboto-Regular' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}