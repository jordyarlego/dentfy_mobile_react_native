import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PutUsuario } from "../../services/api_usuario";
import { useToast } from "../../contexts/ToastContext";
import type { Usuario } from "../../types/usuario";

interface Props {
  visible: boolean;
  usuario: Usuario | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModalEdicaoUsuario({
  visible,
  usuario,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    role: "",
    status: false,
  });
  const { showToast } = useToast();

  useEffect(() => {
    if (usuario) {
      setForm({
        name: usuario.name || "",
        email: usuario.email || "",
        cpf: usuario.cpf || "",
        role: usuario.role || "assistente",
        status: usuario.status || false,
      });
    }
  }, [usuario]);

  const handleSubmit = async () => {
    if (!usuario?._id) return;

    try {
      setLoading(true);
      const dadosAtualizacao = {
        ...form,
        cpf: form.cpf === usuario.cpf ? undefined : form.cpf, // Só envia o CPF se foi alterado
      };

      await PutUsuario(usuario._id, dadosAtualizacao);
      showToast("Usuário atualizado com sucesso!", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      const mensagem = error.message || "Erro ao atualizar usuário";
      showToast(mensagem, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-gray-800 w-[90%] rounded-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-100">
              Editar Usuário
            </Text>
            <TouchableOpacity onPress={onClose}>
              <View>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[70vh]">
            <View className="space-y-4">
              <View>
                <Text className="text-gray-400 mb-1">Nome</Text>
                <TextInput
                  className="bg-gray-700 text-gray-100 p-2 rounded-lg"
                  value={form.name}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View>
                <Text className="text-gray-400 mb-1">Email</Text>
                <TextInput
                  className="bg-gray-700 text-gray-100 p-2 rounded-lg"
                  value={form.email}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, email: text }))
                  }
                  keyboardType="email-address"
                />
              </View>

              <View>
                <Text className="text-gray-400 mb-1">CPF</Text>
                <TextInput
                  className="bg-gray-700 text-gray-100 p-2 rounded-lg"
                  value={form.cpf}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, cpf: text }))
                  }
                  editable={false} // CPF não pode ser editado
                />
                <Text className="text-xs text-gray-500 mt-1">
                  O CPF não pode ser alterado
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-amber-600 p-3 rounded-lg mt-4 ${
                  loading ? "opacity-50" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-center text-gray-900 font-medium">
                    Salvar Alterações
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
