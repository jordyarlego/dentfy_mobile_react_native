import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deletarCaso } from "@/services/caso";
import { useToast } from "@/contexts/ToastContext";
import type { Caso } from "@/types/caso";
import { Heading, Body } from "@/components/Typography";
import { colors } from "@/theme/colors";

const STORAGE_KEYS = {
  CASOS: "@dentify_casos",
} as const;

interface DetalhesCasoProps {
  casoId: string;
}

export default function DetalhesCaso({ casoId }: DetalhesCasoProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [caso, setCaso] = useState<Caso | null>(null);

  useEffect(() => {
    carregarCaso();
  }, [casoId]);

  const carregarCaso = async () => {
    try {
      setLoading(true);
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);

      if (!casosStr) {
        setCaso(null);
        return;
      }

      const casos = JSON.parse(casosStr);
      const casoEncontrado = casos.find(
        (c: Caso) => String(c._id) === String(casoId)
      );

      setCaso(casoEncontrado || null);
    } catch (error) {
      console.error("Erro ao carregar caso:", error);
      setCaso(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: Caso["status"]) => {
    switch (status) {
      case "concluido":
        return "bg-successGreen/10 text-successGreen border-successGreen/30";
      case "em_andamento":
        return "bg-dentfyAmber/10 text-dentfyAmber border-dentfyAmber/30";
      case "arquivado":
        return "bg-errorRed/10 text-errorRed border-errorRed/30";
      default:
        return "bg-dentfyGray600/10 text-dentfyGray600 border-dentfyGray600/30";
    }
  };

  const getStatusText = (status: Caso["status"]) => {
    switch (status) {
      case "concluido":
        return "Concluído";
      case "em_andamento":
        return "Em Andamento";
      case "arquivado":
        return "Arquivado";
      default:
        return status;
    }
  };

  const handleDeletePress = () => {
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deletarCaso(casoId);
      showToast("Caso excluído com sucesso!", "success");
      router.push("/casos");
    } catch (error) {
      console.error("Erro ao deletar caso:", error);
      showToast("Erro ao excluir caso", "error");
    } finally {
      setModalVisible(false);
    }
  };

  if (loading) {
    return (
      <View className="mb-6 items-center justify-center py-8">
        <ActivityIndicator size="large" color={colors.dentfyAmber} />
        <Body className="text-dentfyTextPrimary mt-4">
          Carregando detalhes do caso...
        </Body>
      </View>
    );
  }

  if (!caso) {
    return (
      <View className="mb-6 items-center justify-center py-8">
        <Body className="text-dentfyTextPrimary text-center">
          Caso não encontrado
        </Body>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="bg-dentfyGray800/30 p-4 rounded-lg">
        <View className="flex-row justify-between items-center mb-2">
          <Heading size="large" className="text-dentfyAmber">
            Detalhes do Caso
          </Heading>
          <TouchableOpacity
            onPress={handleDeletePress}
            className="p-2 rounded-full bg-errorRed/10"
          >
            <Ionicons name="trash-outline" size={24} color={colors.errorRed} />
          </TouchableOpacity>
        </View>

        <View className="space-y-2">
          <View className="flex-row justify-between items-center">
            <Body className="text-dentfyTextPrimary flex-1 mr-2">
              {caso.titulo}
            </Body>
            <View
              className={`px-3 py-1 rounded-full border ${getStatusStyle(
                caso.status
              )}`}
            >
              <Body size="small" className="text-current">
                {getStatusText(caso.status)}
              </Body>
            </View>
          </View>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Descrição: </Text>
            {caso.descricao}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Responsável: </Text>
            {caso.responsavel}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Local: </Text>
            {caso.local}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">
              Data de Abertura:{" "}
            </Text>
            {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
          </Body>

          <Body className="text-dentfyTextPrimary">
            <Text className="font-medium text-dentfyAmber">Sexo: </Text>
            {caso.sexo}
          </Body>
        </View>
      </View>

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
                Excluir Caso
              </Heading>
            </View>

            <Body className="text-dentfyTextSecondary text-center mb-6">
              Tem certeza que deseja excluir este caso? Esta ação não pode ser
              desfeita.
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
