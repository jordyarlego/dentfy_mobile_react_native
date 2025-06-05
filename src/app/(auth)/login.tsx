import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Keyboard, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputTeste from "../../components/InputComponent";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const { showToast } = useToast();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  const checkCapsLock = (text: string) => {
    if (text.length === 0) {
      setIsCapsLockOn(false);
      return;
    }

    // Verifica se o último caractere é uma letra
    const lastChar = text[text.length - 1];
    if (!/[a-zA-Z]/.test(lastChar)) {
      return;
    }

    // Verifica se o caractere está em maiúsculo
    const isUpperCase = lastChar === lastChar.toUpperCase() && lastChar !== lastChar.toLowerCase();
    
    // Se o caractere anterior existir e for minúsculo, mas o atual for maiúsculo,
    // provavelmente o caps lock foi ativado
    if (text.length > 1) {
      const prevChar = text[text.length - 2];
      if (/[a-zA-Z]/.test(prevChar) && prevChar === prevChar.toLowerCase() && isUpperCase) {
        setIsCapsLockOn(true);
        return;
      }
    }

    // Se o caractere anterior existir e for maiúsculo, mas o atual for minúsculo,
    // provavelmente o caps lock foi desativado
    if (text.length > 1) {
      const prevChar = text[text.length - 2];
      if (/[a-zA-Z]/.test(prevChar) && prevChar === prevChar.toUpperCase() && !isUpperCase) {
        setIsCapsLockOn(false);
        return;
      }
    }

    // Se não houver mudança de estado, mantém o estado atual
    setIsCapsLockOn(isUpperCase);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    checkCapsLock(text);
  };

  const validateCpf = (cpf: string) => {
    const cleanedCpf = cpf.replace(/[^\d]+/g, "");
    if (cleanedCpf.length !== 11) {
      return "CPF deve conter 11 dígitos";
    }
    return "";
  };


  const handleSubmit = async () => {
    setError("");
    setCpfError("");
    setLoading(true);

    const cleanedCpf = cpf.replace(/[^\d]+/g, "");
    const cpfValidationError = validateCpf(cleanedCpf);
    if (cpfValidationError) {
      setCpfError(cpfValidationError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithTimeout(
        api.post("/api/users/login", {
          cpf: cleanedCpf,
          password,
        })
      );

      const { token, user } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("@dentfy:usuario", JSON.stringify({
        nome: user.name,
        cargo:
          user.role === "admin"
            ? "Administrador"
            : user.role === "perito"
              ? "Perito Criminal"
              : "Assistente",
      }));

      showToast("Login realizado com sucesso!", "success");
      router.replace("/(app)/casos");
    } catch (err: any) {
      const message =
        err.message === "Tempo de resposta excedido"
          ? "Servidor demorou para responder. Tente novamente."
          : err.response?.data?.message || "Erro ao fazer login.";

      setError(message);
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchWithTimeout = (promise: Promise<any>, timeoutMs = 5000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Tempo de resposta excedido")), timeoutMs)
      )
    ]);
  };


  return (
    <ScrollView className="flex-1 bg-dentfyLightBlue">
      <View className="flex-1 p-4 justify-center min-h-screen">
        <View className="bg-dentfyLightBlue p-6 rounded-2xl w-full">
          <View className="items-center mb-6">
            <Text className="text-dentfyTextPrimary font-bold text-4xl mb-2">
              Dent<Text className="text-dentfyAmber">ify</Text>
            </Text>
            <Text className="text-dentfyCyanLight text-center mb-4 text-sm max-w-md">
              Bem-vindo à plataforma de registros periciais odonto-legais!
              Gerencie e consulte casos de forma segura e prática.
            </Text>
            <View className="h-1 w-16 bg-dentfyCyan rounded-full mb-4" />
            <Text className="text-2xl font-bold text-center text-dentfyTextPrimary">
              Login
            </Text>
          </View>

          {error && (
            <Text className="text-errorRed text-center mb-4">{error}</Text>
          )}

          <View className="space-y-4">
            <InputTeste
              label="CPF"
              value={cpf}
              onChangeText={setCpf}
              error={cpfError}
              placeholder="Digite seu CPF"
              keyboardType="numeric"
            />

            <InputTeste
              label="Senha"
              value={password}
              onChangeText={handlePasswordChange}
              placeholder="Digite sua senha"
              secureTextEntry={!showPassword}
              showPasswordToggle
              isPasswordVisible={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {isCapsLockOn && (
              <Text className="text-amber-500 text-xs mt-1">
                Caps Lock está ativado
              </Text>
            )}

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`w-[200px] h-[50px] bg-dentfyCyan rounded-xl mx-auto items-center justify-center ${loading ? "opacity-50" : ""}`}
            >
              {loading ? (
                <ActivityIndicator color={colors.dentfyTextPrimary} />
              ) : (
                <Text className="text-dentfyTextPrimary font-semibold">Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
