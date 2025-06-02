import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import InputTeste from "../../components/InputComponent";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";

export default function Login() {
  const { showToast } = useToast();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <ScrollView className="flex-1 bg-[#12212B]">
      <View className="flex-1 p-4 justify-center min-h-screen">
        <View className="bg-[#12212B] p-6 rounded-2xl w-full">
          <View className="items-center mb-6">
            <Text className="text-white font-bold text-4xl mb-2">
              Dent<Text className="text-amber-500">ify</Text>
            </Text>
            <Text className="text-cyan-100 text-center mb-4 text-sm max-w-md">
              Bem-vindo à plataforma de registros periciais odonto-legais!
              Gerencie e consulte casos de forma segura e prática.
            </Text>
            <View className="h-1 w-16 bg-cyan-400 rounded-full mb-4" />
            <Text className="text-2xl font-bold text-center text-white">
              Login
            </Text>
          </View>

          {error && (
            <Text className="text-red-500 text-center mb-4">{error}</Text>
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
              onChangeText={setPassword}
              placeholder="Digite sua senha"
              secureTextEntry
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`w-[200px] h-[50px] bg-[#01777B] rounded-xl mx-auto items-center justify-center ${loading ? "opacity-50" : ""
                }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold">Entrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
