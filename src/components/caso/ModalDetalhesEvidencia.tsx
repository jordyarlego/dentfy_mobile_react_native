import React from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Evidencia } from "../../types/evidencia";

interface ModalDetalhesEvidenciaProps {
  visible: boolean;
  onClose: () => void;
  evidencia: Evidencia;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ModalDetalhesEvidencia({
  visible,
  onClose,
  evidencia,
  onEdit,
  onDelete,
}: ModalDetalhesEvidenciaProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-gray-900 rounded-t-3xl p-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#F59E0B" }}
            >
              Detalhes da Evidência
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            <View>
              <Text className="text-dentfyTextSecondary">Título</Text>
              <Text className="text-dentfyTextPrimary">{evidencia.titulo}</Text>
            </View>
            <View>
              <Text className="text-dentfyTextSecondary">Local</Text>
              <Text className="text-dentfyTextPrimary">
                {evidencia.localColeta}
              </Text>
            </View>
            <View>
              <Text className="text-dentfyTextSecondary">Tipo</Text>
              <Text className="text-dentfyTextPrimary">{evidencia.tipo}</Text>
            </View>
            <View>
              <Text className="text-dentfyTextSecondary">Coletado por</Text>
              <Text className="text-dentfyTextPrimary">
                {evidencia.coletadoPor}
              </Text>
            </View>
            {evidencia.imagemURL && (
              <Image
                source={{ uri: evidencia.imagemURL }}
                className="w-full h-48 rounded-lg"
                resizeMode="cover"
              />
            )}
          </ScrollView>

          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={onDelete}
              className="flex-1 p-4 bg-red-600 rounded-lg"
            >
              <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
                Excluir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onEdit}
              className="flex-1 p-4 bg-amber-600 rounded-lg"
            >
              <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
                Editar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
