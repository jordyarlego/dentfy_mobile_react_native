import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useToast } from "../../../contexts/ToastContext";
import InputComponent from "../../../components/InputComponent";
import { Picker } from "@react-native-picker/picker";
import HeaderPerito from "../../../components/header";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../theme/colors";
import { Heading, Body } from "../../../components/Typography";
import { PostUsuario } from "../../../services/api_usuario";

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  senha: string;
  confirmarSenha: string;
}

export default function NovoUsuario() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    email: "",
    cpf: "",
    cargo: "perito",
    senha: "",
    confirmarSenha: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Validações locais
      if (
        !formData.nome ||
        !formData.email ||
        !formData.cpf ||
        !formData.cargo ||
        !formData.senha ||
        !formData.confirmarSenha
      ) {
        showToast("Por favor, preencha todos os campos", "error");
        return;
      }

      // Validação de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showToast("Digite um e-mail válido", "error");
        return;
      }

      // Validação de CPF (apenas números)
      const cpfRegex = /^\d{11}$/;
      if (!cpfRegex.test(formData.cpf)) {
        showToast("CPF deve conter 11 números", "error");
        return;
      }

      if (formData.senha !== formData.confirmarSenha) {
        showToast("As senhas não coincidem", "error");
        return;
      }

      if (formData.senha.length < 6) {
        showToast("A senha deve ter pelo menos 6 caracteres", "error");
        return;
      }

      setLoading(true);

      await PostUsuario({
        name: formData.nome,
        email: formData.email,
        password: formData.senha,
        confirmarSenha: formData.confirmarSenha,
        cpf: formData.cpf,
        role: formData.cargo as "perito" | "assistente",
      });

      showToast("Usuário criado com sucesso!", "success");
      router.push("/usuarios");
    } catch (error: any) {
      showToast(error.message || "Erro ao criar usuário", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dentfyDarkBlue">
      <HeaderPerito showBackButton />
      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          <InputComponent
            label="Nome"
            placeholder="Digite o nome"
            value={formData.nome}
            onChangeText={(text: string) => handleInputChange("nome", text)}
            className="bg-dentfyGray800 border-dentfyBorderGray text-dentfyTextPrimary rounded-lg"
            placeholderTextColor={colors.dentfyTextSecondary}
          />

          <InputComponent
            label="Email"
            placeholder="Digite o email"
            value={formData.email}
            onChangeText={(text: string) => handleInputChange("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-dentfyGray800 border-dentfyBorderGray text-dentfyTextPrimary rounded-lg"
            placeholderTextColor={colors.dentfyTextSecondary}
          />

          <InputComponent
            label="CPF"
            placeholder="Digite o CPF"
            value={formData.cpf}
            onChangeText={(text: string) => handleInputChange("cpf", text)}
            keyboardType="numeric"
            maxLength={11}
            className="bg-dentfyGray800 border-dentfyBorderGray text-dentfyTextPrimary rounded-lg"
            placeholderTextColor={colors.dentfyTextSecondary}
          />

          <View className="mb-4">
            <Body className="text-dentfyTextPrimary mb-1">Cargo</Body>
            <View className="border border-dentfyBorderGray rounded-lg bg-dentfyGray800 overflow-hidden">
              <Picker
                selectedValue={formData.cargo}
                onValueChange={(value: string) =>
                  handleInputChange("cargo", value)
                }
                style={{ height: 50 }}
                dropdownIconColor={colors.dentfyAmber}
                mode="dropdown"
              >
                <Picker.Item
                  label="Perito"
                  value="perito"
                  color={colors.dentfyAmber}
                />
                <Picker.Item
                  label="Assistente"
                  value="assistente"
                  color={colors.dentfyAmber}
                />
              </Picker>
            </View>
          </View>

          <InputComponent
            label="Senha"
            placeholder="Digite a senha"
            value={formData.senha}
            onChangeText={(text: string) => handleInputChange("senha", text)}
            secureTextEntry
            className="bg-dentfyGray800 border-dentfyBorderGray text-dentfyTextPrimary rounded-lg"
            placeholderTextColor={colors.dentfyTextSecondary}
          />

          <InputComponent
            label="Confirmar Senha"
            placeholder="Confirme a senha"
            value={formData.confirmarSenha}
            onChangeText={(text: string) =>
              handleInputChange("confirmarSenha", text)
            }
            secureTextEntry
            className="bg-dentfyGray800 border-dentfyBorderGray text-dentfyTextPrimary rounded-lg"
            placeholderTextColor={colors.dentfyTextSecondary}
          />

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`bg-dentfyAmber p-4 rounded-lg mt-4 ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#0E1A26" />
            ) : (
              <Body className="text-dentfyDarkBlue text-center font-semibold">
                Criar Usuário
              </Body>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
