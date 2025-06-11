import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GetUsuarioById, DeleteUsuario } from "../../services/api_usuario";
import { useToast } from "../../contexts/ToastContext";
import type { Usuario } from "../../types/usuario";
import ModalEdicaoUsuario from "./ModalEdicaoUsuario";

interface ModalVisualizacaoUsuarioProps {
  visible: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (_id: string) => void;
}

export default function ModalVisualizacaoUsuario({
  visible,
  usuario,
  onClose,
  onEdit,
  onDelete,
}: ModalVisualizacaoUsuarioProps) {
  const [loading, setLoading] = useState(false);
  const [deletando, setDeletando] = useState(false);
  const [detalhesUsuario, setDetalhesUsuario] = useState<Usuario | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (visible && usuario?._id) {
      carregarDetalhesUsuario(usuario._id);
    }
  }, [visible, usuario]);

  const carregarDetalhesUsuario = async (id: string) => {
    try {
      setLoading(true);
      const dados = await GetUsuarioById(id);
      setDetalhesUsuario(dados);
    } catch (error: any) {
      showToast(
        error.message || "Erro ao carregar detalhes do usuário",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!detalhesUsuario?._id) return;

    Alert.alert(
      "Confirmar Exclusão",
      `Deseja realmente excluir o usuário ${detalhesUsuario.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletando(true);
              await DeleteUsuario(detalhesUsuario._id!);
              showToast("Usuário excluído com sucesso!", "success");
              onDelete(detalhesUsuario._id!);
            } catch (error: any) {
              showToast(
                error.response?.data?.message || "Erro ao excluir usuário",
                "error"
              );
            } finally {
              setDeletando(false);
              onClose();
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleEditSuccess = async () => {
    if (usuario?._id) {
      await carregarDetalhesUsuario(usuario._id);
      onEdit(detalhesUsuario!);
    }
  };

  if (!visible || !usuario) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-gray-800 w-[90%] rounded-xl p-4">
            {loading ? (
              <View className="py-8">
                <ActivityIndicator size="large" color="#F59E0B" />
                <Text className="text-gray-400 text-center mt-4">
                  Carregando detalhes...
                </Text>
              </View>
            ) : (
              <>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-bold text-gray-100">
                    Detalhes do Usuário
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Conteúdo */}
                <ScrollView className="max-h-[70vh]">
                  <View className="space-y-4">
                    {/* ID */}
                    <View>
                      <Text className="text-sm font-medium mb-1 text-amber-500">
                        ID
                      </Text>
                      <Text className="text-gray-100">{usuario._id}</Text>
                    </View>

                    {/* Nome */}
                    <View>
                      <View className="flex-row items-center">
                        <View style={{ marginRight: 4 }}>
                          <Ionicons
                            name="person-outline"
                            size={14}
                            color="#F59E0B"
                          />
                        </View>
                        <Text className="text-sm font-medium mb-1 text-amber-500">
                          Nome Completo
                        </Text>
                      </View>
                      <Text className="text-gray-100">
                        {detalhesUsuario?.name}
                      </Text>
                    </View>

                    {/* Email */}
                    <View>
                      <View className="flex-row items-center">
                        <View style={{ marginRight: 4 }}>
                          <Ionicons
                            name="mail-outline"
                            size={14}
                            color="#F59E0B"
                          />
                        </View>
                        <Text className="text-sm font-medium mb-1 text-amber-500">
                          E-mail
                        </Text>
                      </View>
                      <Text className="text-gray-100">
                        {detalhesUsuario?.email}
                      </Text>
                    </View>

                    {/* CPF */}
                    <View>
                      <View className="flex-row items-center">
                        <View style={{ marginRight: 4 }}>
                          <Ionicons
                            name="card-outline"
                            size={14}
                            color="#F59E0B"
                          />
                        </View>
                        <Text className="text-sm font-medium mb-1 text-amber-500">
                          CPF
                        </Text>
                      </View>
                      <Text className="text-gray-100">
                        {detalhesUsuario?.cpf}
                      </Text>
                    </View>

                    {/* Cargo */}
                    <View>
                      <View className="flex-row items-center">
                        <View style={{ marginRight: 4 }}>
                          <Ionicons
                            name="person-circle-outline"
                            size={14}
                            color="#F59E0B"
                          />
                        </View>
                        <Text className="text-sm font-medium mb-1 text-amber-500">
                          Cargo
                        </Text>
                      </View>
                      <Text className="text-gray-100">
                        {detalhesUsuario?.role}
                      </Text>
                    </View>

                    {/* Status */}
                    <View>
                      <View className="flex-row items-center">
                        <View style={{ marginRight: 4 }}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={14}
                            color="#F59E0B"
                          />
                        </View>
                        <Text className="text-sm font-medium mb-1 text-amber-500">
                          Status
                        </Text>
                      </View>
                      <Text
                        className={`${
                          detalhesUsuario?.status
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {detalhesUsuario?.status ? "Ativo" : "Inativo"}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Botões de Ação */}
                <View className="flex-row justify-end gap-3 mt-6">
                  <TouchableOpacity
                    onPress={handleEdit}
                    className="bg-amber-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-gray-900 font-medium">Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDelete}
                    disabled={deletando}
                    className="bg-red-500 px-4 py-2 rounded-lg opacity-${
                      deletando ? 50 : 100
                    }"
                  >
                    {deletando ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text className="text-white font-medium">Excluir</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ModalEdicaoUsuario
        visible={editModalVisible}
        usuario={detalhesUsuario}
        onClose={() => setEditModalVisible(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
