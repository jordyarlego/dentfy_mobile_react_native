import 'expo-router/entry'; 
import { Slot } from 'expo-router';
import { useCustomFonts } from './src/assets/fonts';
import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';

export default function App() {
  const fontsLoaded = useCustomFonts();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('Fontes carregadas:', fontsLoaded);
    if (fontsLoaded) {
      // Pequeno delay para garantir que tudo esteja inicializado
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Roboto-Regular' }}>Carregando...</Text>
      </View>
    );
  }

  return <Slot />;
}