import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Pressable,
  Modal, // Adicionado Modal aqui
} from "react-native";
import { useRouter } from "expo-router";
import { Heading, Body } from "../Typography";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Evidencia } from "../../types/evidencia";
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

  useEffect(() => {
    carregarEvidencias();
  }, [casoId]);

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
            <View
              key={evidencia._id}
              className="bg-dentfyGray800/30 p-4 rounded-lg"
            >
              <Body className="text-dentfyTextPrimary font-bold mb-2">
                {evidencia.titulo}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Tipo: {evidencia.tipo}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Local: {evidencia.localColeta}
              </Body>
              <Body className="text-dentfyTextSecondary mb-2">
                Coletado por: {evidencia.coletadoPor || "Não informado"}
              </Body>
              {evidencia.imagemURL && (
                <Image
                  source={{ uri: evidencia.imagemURL }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
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
