import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Usuario } from "../../types/usuario";
import { GetUsuarios } from "../../services/api_usuario";
import { useToast } from "../../contexts/ToastContext";
import { useRouter } from "expo-router";
import ModalVisualizacaoUsuario from "./ModalVisualizacaoUsuario";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [acessoNegado, setAcessoNegado] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        showToast(
          "Sua sessão expirou. Por favor, faça login novamente.",
          "error"
        );
        router.push("/login");
        return;
      }
      const response = await GetUsuarios();
      setUsuarios(response);
      setAcessoNegado(false);
    } catch (error: any) {
      console.error("Erro ao carregar usuários:", error);
      if (error.response?.status === 403) {
        setAcessoNegado(true);
        showToast("Você não tem permissão para acessar esta área.", "error");
      } else {
        showToast("Não foi possível carregar a lista de usuários.", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast, router]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsuarios();
    setRefreshing(false);
  }, [loadUsuarios]);

  const saveUsuarios = async (usuariosToSave: Usuario[]) => {
    try {
      setUsuarios(usuariosToSave);
    } catch (error) {
      showToast("Erro ao atualizar lista de usuários", "error");
    }
  };

  const handleUserPress = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setModalVisible(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    showToast("Funcionalidade de edição ainda não implementada", "info");
    console.log("Editar usuário:", usuario);
    setModalVisible(false);
  };

  const handleDeleteUser = async (_id: string) => {
    try {
      const usuariosAtualizados = usuarios.filter((user) => user._id !== _id);
      setUsuarios(usuariosAtualizados);
      await loadUsuarios(); // Recarrega a lista após exclusão
    } catch (error) {
      showToast("Erro ao atualizar lista de usuários", "error");
    }
  };

  const handleAddUser = () => {
    router.push("/usuarios/novo");
  };

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.name.toLowerCase().includes(search.toLowerCase()) ||
      usuario.email.toLowerCase().includes(search.toLowerCase()) ||
      usuario.cpf.includes(search)
  );

  const renderStatus = (usuario: Usuario) => {
    // Verifica se o status existe e não é false
    const isAtivo = usuario.status !== false && usuario.status !== "false";

    return isAtivo ? (
      <View className="bg-green-500/20 px-2 py-1 rounded-full">
        <Text className="text-green-400 text-xs font-medium">Ativo</Text>
      </View>
    ) : (
      <View className="bg-red-500/20 px-2 py-1 rounded-full">
        <Text className="text-red-400 text-xs font-medium">Inativo</Text>
      </View>
    );
  };

  const renderUserRole = (role: string) => {
    return (
      <Text className="text-gray-400 text-sm">
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Text>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-gray-400 mt-4">Carregando usuários...</Text>
      </View>
    );
  }

  if (acessoNegado) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 p-6">
        <View className="bg-red-500/20 p-6 rounded-xl items-center">
          <Ionicons name="lock-closed" size={64} color="#EF4444" />
          <Text className="text-2xl font-bold text-red-500 mt-4">
            Acesso Restrito
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Desculpe, mas você não tem permissão para acessar esta área. Entre
            em contato com um administrador para solicitar acesso.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-red-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Campo de Busca */}
      <View className="mb-4">
        <TextInput
          className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
          placeholder="Buscar usuário (Nome, Email, CPF)"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity
        onPress={handleAddUser}
        className="flex-row items-center justify-center gap-2 px-4 py-3 bg-amber-600 rounded-lg mb-4"
      >
        <View>
          <Ionicons name="add-circle-outline" size={20} color="#0E1A26" />
        </View>
        <Text className="text-[#0E1A26] font-medium">
          Adicionar Novo Usuário
        </Text>
      </TouchableOpacity>

      {/* Lista de Usuários */}
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#F59E0B"]}
            tintColor={"#F59E0B"}
          />
        }
      >
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((usuario) => (
            <TouchableOpacity
              key={usuario._id}
              className="bg-gray-800/30 p-4 rounded-lg mb-3 border border-gray-700"
              onPress={() => handleUserPress(usuario)}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-lg font-bold text-gray-100">
                    {usuario.name}
                  </Text>
                  {renderUserRole(usuario.role)}
                </View>
                <View className="flex-row items-center">
                  {renderStatus(usuario)}
                  <View style={{ marginLeft: 4 }}>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#9CA3AF"
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Ionicons name="people-outline" size={50} color="#6B7280" />
            <Text className="text-gray-400 mt-4">
              Nenhum usuário encontrado.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Visualização */}
      <ModalVisualizacaoUsuario
        visible={modalVisible}
        usuario={selectedUser}
        onClose={() => setModalVisible(false)}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </View>
  );
}
