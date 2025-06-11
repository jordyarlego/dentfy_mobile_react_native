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
import {
  buscarEvidenciasPorCaso,
  deletarEvidencia,
} from "../../services/api_evidencia";
import { useToast } from "../../contexts/ToastContext";

export interface ListaEvidenciasProps {
  casoId: string;
}

export default function ListaEvidencias({ casoId }: ListaEvidenciasProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [evidenciaToDelete, setEvidenciaToDelete] = useState<string | null>(
    null
  );
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

  const handleDeletePress = (evidenciaId: string) => {
    setEvidenciaToDelete(evidenciaId);
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!evidenciaToDelete) return;

    try {
      await deletarEvidencia(evidenciaToDelete);
      await carregarEvidencias();
      showToast("Evidência excluída com sucesso!", "success");
      setModalVisible(false);
      setEvidenciaToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar evidência:", error);
      showToast("Erro ao excluir evidência", "error");
    }
  };

  const formatarData = (data: string | Date) => {
    if (!data) return "";
    try {
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return String(data);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "imagem":
        return "image";
      case "texto":
        return "document-text";
      default:
        return "document";
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
                        <Ionicons
                          name={getTipoIcon(evidencia.tipo)}
                          size={16}
                          color={colors.dentfyTextSecondary}
                        />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Tipo:{" "}
                          {evidencia.tipo === "imagem" ? "Imagem" : "Documento"}
                        </Body>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color={colors.dentfyTextSecondary}
                        />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Local: {evidencia.localColeta}
                        </Body>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons
                          name="person-outline"
                          size={16}
                          color={colors.dentfyTextSecondary}
                        />
                        <Body className="text-dentfyTextSecondary text-sm ml-2">
                          Coletado por:{" "}
                          {evidencia.coletadoPor || "Não informado"}
                        </Body>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color={colors.dentfyTextSecondary}
                        />
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
                          <Ionicons
                            name="expand-outline"
                            size={16}
                            color={colors.dentfyAmber}
                          />
                        </View>
                      </View>
                    )}

                    {/* Preview da descrição */}
                    {evidencia.descricao && (
                      <View className="mt-2">
                        <Body
                          className="text-dentfyTextSecondary text-sm"
                          numberOfLines={2}
                        >
                          {evidencia.descricao}
                        </Body>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center ml-3">
                    <TouchableOpacity
                      onPress={() => handleDeletePress(evidencia._id)}
                      className="mr-2 p-2"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#DC2626" // Alterado para usar a mesma cor do botão do modal (bg-red-600)
                      />
                    </TouchableOpacity>
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

      {/* Modal de Confirmação de Delete */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 items-center justify-center p-4">
          <View className="bg-dentfyGray800 rounded-2xl p-6 w-full max-w-sm border border-dentfyGray700">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-errorRed/20 rounded-full items-center justify-center mb-3">
                <Ionicons name="warning" size={32} color={colors.errorRed} />
              </View>
              <Heading
                size="medium"
                className="text-dentfyTextPrimary text-center"
              >
                Excluir Evidência
              </Heading>
            </View>

            <Body className="text-dentfyTextSecondary text-center mb-6">
              Tem certeza que deseja excluir esta evidência? Esta ação não pode
              ser desfeita.
            </Body>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 p-4 bg-dentfyGray700 rounded-lg border border-dentfyGray600"
              >
                <Body className="text-center text-dentfyTextSecondary font-medium">
                  Cancelar
                </Body>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmDelete}
                className="flex-1 p-4 bg-errorRed rounded-lg"
              >
                <Body className="text-center text-white font-medium">
                  Excluir
                </Body>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
