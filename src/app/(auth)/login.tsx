import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Keyboard, NativeSyntheticEvent, TextInputChangeEventData } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputTeste from "../../components/InputComponent";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from '../../contexts/ToastContext';

export default function Login() {
  const { signIn } = useAuth();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const { showToast } = useToast();

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

  const handleLogin = async () => {
    if (!cpf || !password) {
      showToast('Por favor, preencha todos os campos', 'error');
      return;
    }

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
      console.log('=== INÍCIO DO LOGIN ===');
      console.log('Tentando fazer login com CPF:', cleanedCpf);

      const response = await api.post("/api/users/login", {
        cpf: cleanedCpf,
        password,
      });

      console.log('Resposta do login:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 200 && response.data.token) {
        console.log('Login bem sucedido, token recebido');
        const token = response.data.token;
        const userData = response.data.user;

        console.log('Dados do usuário retornados pelo backend:', userData);

        const userToStore = {
           _id: userData._id || userData.id,
          nome: userData.name,
          cargo:
            userData.role === "admin"
              ? "Administrador"
              : userData.role === "perito"
                ? "Perito Criminal"
                : "Assistente",
        };

        await AsyncStorage.setItem("@dentfy:usuario", JSON.stringify(userToStore));
        console.log('Usuário salvo no AsyncStorage:', userToStore);

        await signIn(token);

        console.log('Login concluído com sucesso');
        showToast('Login realizado com sucesso!', 'success');
      } else {
        console.error('Resposta inválida do servidor:', response.data);
        showToast('Erro ao fazer login. Tente novamente.', 'error');
      }
    } catch (error: any) {
      console.error('Erro durante o login:', error);

      // Tratamento específico de erros
      if (error.response) {
        // Erro com resposta do servidor
        const status = error.response.status;
        const message = error.response.data?.message || 'Erro ao fazer login';

        if (status === 401) {
          showToast('Email ou senha incorretos', 'error');
        } else if (status === 404) {
          showToast('Usuário não encontrado', 'error');
        } else {
          showToast(message, 'error');
        }
      } else if (error.request) {
        // Erro de rede
        showToast('Erro de conexão. Verifique sua internet.', 'error');
      } else {
        // Outros erros
        showToast('Ocorreu um erro inesperado', 'error');
      }
    } finally {
      setLoading(false);
    }
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
              onPress={handleLogin}
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
