import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Modal, Dimensions, StatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Heading, Body } from '../Typography';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import type { Evidencia } from '../../types/caso';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants/storage';

export interface ListaEvidenciasProps {
  casoId: string;
}

export default function ListaEvidencias({ casoId }: ListaEvidenciasProps) {
  const router = useRouter();
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  useEffect(() => {
    console.log('ListaEvidencias: Carregando evidências para caso:', casoId);
    carregarEvidencias();
  }, [casoId]);

  const carregarEvidencias = async () => {
    try {
      console.log('ListaEvidencias: Buscando casos no AsyncStorage...');
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      console.log('ListaEvidencias: Casos carregados:', casosStr);

      if (!casosStr) {
        console.log('ListaEvidencias: Nenhum caso encontrado');
        setEvidencias([]);
        return;
      }

      const casos = JSON.parse(casosStr);
      console.log('ListaEvidencias: Total de casos:', casos.length);
      
      const caso = casos.find((c: any) => String(c._id) === String(casoId));
      console.log('ListaEvidencias: Caso encontrado:', caso ? 'Sim' : 'Não');
      
      if (!caso) {
        console.log('ListaEvidencias: Caso não encontrado com ID:', casoId);
        setEvidencias([]);
        return;
      }

      console.log('ListaEvidencias: Evidências encontradas:', caso.evidencias?.length || 0);
      setEvidencias(caso.evidencias || []);
    } catch (error) {
      console.error('ListaEvidencias: Erro ao carregar evidências:', error);
      setEvidencias([]);
    }
  };

  const handleAddEvidencia = () => {
    router.push(`/caso/${casoId}/evidencia/nova`);
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Heading size="medium" className="text-dentfyAmber">
          Evidências
        </Heading>
        <TouchableOpacity
          onPress={handleAddEvidencia}
          className="p-2 rounded-full bg-dentfyAmber/10"
        >
          <Ionicons name="add" size={24} color={colors.dentfyAmber} />
        </TouchableOpacity>
      </View>
      
      {evidencias.length === 0 ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg">
          <Body className="text-dentfyTextPrimary text-center">
            Nenhuma evidência registrada
          </Body>
        </View>
      ) : (
        <View className="space-y-4">
          {evidencias.map((evidencia) => (
            <View key={evidencia._id} className="bg-dentfyGray800/30 p-4 rounded-lg">
              <Body className="text-dentfyTextPrimary font-bold mb-2">
                {evidencia.titulo}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Tipo: {evidencia.tipo}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Local: {evidencia.local}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Coletada por: {evidencia.coletadaPor}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Data: {new Date(evidencia.dataColeta).toLocaleDateString('pt-BR')}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                {evidencia.descricao}
              </Body>
              {evidencia.imagemUri && (
                <Pressable 
                  onPress={() => setSelectedImage(evidencia.imagemUri || null)}
                  className="relative mt-2"
                >
                  <Image
                    source={{ uri: evidencia.imagemUri }}
                    className="w-full h-48 rounded-lg"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-2 right-2 bg-dentfyGray800/80 p-2 rounded-full">
                    <Ionicons name="expand-outline" size={20} color={colors.dentfyAmber} />
                  </View>
                </Pressable>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Modal de Imagem em Tela Cheia */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
        statusBarTranslucent
      >
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Pressable 
          onPress={() => setSelectedImage(null)}
          className="flex-1 bg-black"
        >
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: selectedImage || '' }}
              style={{
                width: screenWidth,
                height: screenHeight * 0.8,
              }}
              resizeMode="contain"
            />
          </View>
          <View className="absolute top-12 right-4">
            <Pressable 
              onPress={() => setSelectedImage(null)}
              className="bg-dentfyGray800/80 p-3 rounded-full"
            >
              <Ionicons name="close" size={24} color={colors.dentfyTextPrimary} />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
} 