import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Heading, Body } from "../Typography";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Evidencia } from "../../services/api_evidencia";
import { buscarEvidenciasPorCaso } from "../../services/api_evidencia";

export interface ListaEvidenciasProps {
  casoId: string;
}

export default function ListaEvidencias({ casoId }: ListaEvidenciasProps) {
  const router = useRouter();
  const [evidencias, setEvidencias] = useState<Evidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  useFocusEffect(
    React.useCallback(() => {
      carregarEvidencias();
    }, [casoId])
  );

  const carregarEvidencias = async () => {
    try {
      setLoading(true);
      const response = await buscarEvidenciasPorCaso(casoId);
      setEvidencias(response);
    } catch (error) {
      console.error("ListaEvidencias: Erro ao carregar evidências:", error);
      setEvidencias([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvidencia = () => {
    router.push(`/caso/${casoId}/evidencia/nova`);
  };

  const handleEvidenciaPress = (evidenciaId: string) => {
    router.push(`/caso/${casoId}/evidencia/${evidenciaId}`);
  };

  const formatarData = (data: string | Date) => {
    if (!data) return '';
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return String(data);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'imagem':
        return 'image';
      case 'texto':
        return 'document-text';
      default:
        return 'document';
    }
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

      {loading ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg items-center justify-center min-h-[100px]">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextPrimary text-center mt-2">
            Carregando evidências...
          </Body>
        </View>
      ) : evidencias.length === 0 ? (
        <View className="bg-dentfyGray800/30 p-4 rounded-lg">
          <Body className="text-dentfyTextPrimary text-center">
            Nenhuma evidência registrada
          </Body>
        </View>
      ) : (
        <View className="space-y-4">
          {evidencias.map((evidencia, index) => (
            <View key={evidencia._id}>
              <TouchableOpacity
                onPress={() => handleEvidenciaPress(evidencia._id)}
                className="bg-dentfyGray800/30 p-4 rounded-lg border border-dentfyGray700/30 active:bg-dentfyGray800/50"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Body className="text-dentfyTextPrimary font-semibold text-lg mb-2">
                      {evidencia.titulo}
                    </Body>
                    
                    <View className="space-y-1 mb-3">
                      <View className="flex-row items-center">
                        <Ionicons name={getTipoIcon(evidencia.tipo)} size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Tipo: {evidencia.tipo === 'imagem' ? 'Imagem' : 'Documento'}
                        </Body>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Local: {evidencia.localColeta}
                        </Body>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Coletado por: {evidencia.coletadoPor || "Não informado"}
                        </Body>
                      </View>
                      
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={16} color={colors.dentfyTextSecondary} />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Data: {formatarData(evidencia.dataColeta)}
                        </Body>
                      </View>
                    </View>

                    {/* Preview da imagem */}
                    {evidencia.imagemURL && (
                      <View className="relative">
                        <Image
                          source={{ uri: evidencia.imagemURL }}
                          className="w-full h-32 rounded-lg"
                          resizeMode="cover"
                        />
                        <View className="absolute bottom-2 right-2 bg-dentfyGray800/80 p-2 rounded-full">
                          <Ionicons name="expand-outline" size={16} color={colors.dentfyAmber} />
                        </View>
                      </View>
                    )}

                    {/* Preview da descrição */}
                    {evidencia.descricao && (
                      <View className="mt-2">
                        <Body className="text-dentfyTextSecondary text-sm" numberOfLines={2}>
                          {evidencia.descricao}
                        </Body>
                      </View>
                    )}
                  </View>
                  
                  <View className="ml-3">
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={colors.dentfyTextSecondary} 
                    />
                  </View>
                </View>
              </TouchableOpacity>
              
              {/* Separador âmbar entre cards (exceto no último) */}
              {index < evidencias.length - 1 && (
                <View className="h-0.5 bg-dentfyAmber/20 mx-4 mt-4 rounded-full" />
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
              source={{ uri: selectedImage || "" }}
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
              <Ionicons
                name="close"
                size={24}
                color={colors.dentfyTextPrimary}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
