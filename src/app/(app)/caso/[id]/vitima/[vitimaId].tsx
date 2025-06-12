import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderPerito from "@/components/header";
import { Body, Heading } from "@/components/Typography";
import { colors } from "@/theme/colors";
import type { Vitima } from "@/services/api_vitima";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { buscarOdontogramaVitima } from "@/services/api_vitima";
import {
  buscarVitimaPorId,
  atualizarVitima,
  deletarVitima,
} from "@/services/api_vitima";

type Coordenada = { top: number; left: number };

const icones: Record<string, { icon: string; color: string; library: string }> =
  {
    carie: { icon: "alert-circle", color: "#EF4444", library: "Ionicons" },
    fratura: { icon: "close-circle", color: "#F59E0B", library: "Ionicons" },
    ausente: { icon: "remove-circle", color: "#6B7280", library: "Ionicons" },
    restauracao: {
      icon: "checkmark-circle",
      color: "#3B82F6",
      library: "Ionicons",
    },
    implante: { icon: "diamond", color: "#8B5CF6", library: "Ionicons" },
    protese: { icon: "star", color: "#10B981", library: "Ionicons" },
  };

const renderIcon = (tipo: string, size: number = 16) => {
  const icone = icones[tipo];
  if (!icone) return null;

  switch (icone.library) {
    case "Ionicons":
      return (
        <Ionicons name={icone.icon as any} size={size} color={icone.color} />
      );
    case "MaterialIcons":
      return (
        <MaterialIcons
          name={icone.icon as any}
          size={size}
          color={icone.color}
        />
      );
    case "FontAwesome5":
      return (
        <FontAwesome5
          name={icone.icon as any}
          size={size}
          color={icone.color}
        />
      );
    default:
      return (
        <Ionicons name={icone.icon as any} size={size} color={icone.color} />
      );
  }
};

const getMapaCoordenadas = (
  imageWidth: number,
  imageHeight: number
): Record<string, Coordenada> => {
  return {
    // Dentes superiores (11-18, 21-28) - Ajustados para melhor posicionamento
    "11": { top: imageHeight * 0.12, left: imageWidth * 0.48 },
    "12": { top: imageHeight * 0.12, left: imageWidth * 0.44 },
    "13": { top: imageHeight * 0.12, left: imageWidth * 0.4 },
    "14": { top: imageHeight * 0.12, left: imageWidth * 0.36 },
    "15": { top: imageHeight * 0.12, left: imageWidth * 0.32 },
    "16": { top: imageHeight * 0.12, left: imageWidth * 0.28 },
    "17": { top: imageHeight * 0.12, left: imageWidth * 0.24 },
    "18": { top: imageHeight * 0.12, left: imageWidth * 0.2 },
    "21": { top: imageHeight * 0.12, left: imageWidth * 0.52 },
    "22": { top: imageHeight * 0.12, left: imageWidth * 0.56 },
    "23": { top: imageHeight * 0.12, left: imageWidth * 0.6 },
    "24": { top: imageHeight * 0.12, left: imageWidth * 0.64 },
    "25": { top: imageHeight * 0.12, left: imageWidth * 0.68 },
    "26": { top: imageHeight * 0.12, left: imageWidth * 0.72 },
    "27": { top: imageHeight * 0.12, left: imageWidth * 0.76 },
    "28": { top: imageHeight * 0.12, left: imageWidth * 0.8 },
    // Dentes inferiores (31-38, 41-48) - Ajustados para melhor posicionamento
    "31": { top: imageHeight * 0.88, left: imageWidth * 0.48 },
    "32": { top: imageHeight * 0.88, left: imageWidth * 0.44 },
    "33": { top: imageHeight * 0.88, left: imageWidth * 0.4 },
    "34": { top: imageHeight * 0.88, left: imageWidth * 0.36 },
    "35": { top: imageHeight * 0.88, left: imageWidth * 0.32 },
    "36": { top: imageHeight * 0.88, left: imageWidth * 0.28 },
    "37": { top: imageHeight * 0.88, left: imageWidth * 0.24 },
    "38": { top: imageHeight * 0.88, left: imageWidth * 0.2 },
    "41": { top: imageHeight * 0.88, left: imageWidth * 0.52 },
    "42": { top: imageHeight * 0.88, left: imageWidth * 0.56 },
    "43": { top: imageHeight * 0.88, left: imageWidth * 0.6 },
    "44": { top: imageHeight * 0.88, left: imageWidth * 0.64 },
    "45": { top: imageHeight * 0.88, left: imageWidth * 0.68 },
    "46": { top: imageHeight * 0.88, left: imageWidth * 0.72 },
    "47": { top: imageHeight * 0.88, left: imageWidth * 0.76 },
    "48": { top: imageHeight * 0.88, left: imageWidth * 0.8 },
  };
};

type Sexo = "Masculino" | "Feminino" | "Outro";
type Etnia = "Preto" | "Pardo" | "Branco" | "Amarelo" | "Indígena";

export default function DetalhesVitima() {
  const { vitimaId, id: casoId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Vitima | null>(null);
  const [dentesAvariados, setDentesAvariados] = useState<{
    [numero: string]: string;
  }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Cálculo das dimensões da imagem (igual ao odontograma)
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const isSmallScreen = screenWidth < 400;
  const isLargeScreen = screenWidth > 768;
  const isIOS = Platform.OS === "ios";

  // Ajusta o tamanho da imagem baseado na tela (igual ao odontograma)
  const imageWidth = isSmallScreen
    ? screenWidth - 32
    : isLargeScreen
    ? 400
    : 300;
  const imageHeight = isSmallScreen ? 150 : isLargeScreen ? 280 : 200;

  useEffect(() => {
    if (typeof vitimaId === "string") {
      carregarVitima(vitimaId);
    }
  }, [vitimaId]);

  const carregarVitima = async (id: string) => {
    try {
      setLoading(true);
      const vitima = await buscarVitimaPorId(id);
      setFormData(vitima);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar vítima", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }

    try {
      const odontograma = await buscarOdontogramaVitima(id);
      const mapa = odontograma.reduce((acc, avaria) => {
        acc[avaria.numero] = avaria.descricao;
        return acc;
      }, {} as { [numero: string]: string });
      setDentesAvariados(mapa);
    } catch (error) {
      console.error("Erro ao carregar odontograma:", error);
    }
  };

  const onRefresh = async () => {
    if (typeof vitimaId === "string") {
      setRefreshing(true);
      try {
        await carregarVitima(vitimaId);
        // Feedback visual sutil de sucesso
        console.log("Dados atualizados com sucesso");
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
        Alert.alert(
          "Erro",
          "Não foi possível atualizar os dados. Tente novamente."
        );
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleChange = (field: keyof Vitima, value: any) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async () => {
    if (!formData || !vitimaId) return;

    // Validar campos obrigatórios
    const camposObrigatorios: (keyof Omit<
      Vitima,
      "_id" | "criadoEm" | "odontograma" | "caso"
    >)[] = [
      "nomeCompleto",
      "dataNascimento",
      "sexo",
      "etnia",
      "endereco",
      "cpf",
    ];

    const camposFaltantes = camposObrigatorios.filter(
      (campo) => !formData[campo] || formData[campo]?.toString().trim() === ""
    );

    if (camposFaltantes.length > 0) {
      Alert.alert(
        "Campos obrigatórios",
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    try {
      setSaving(true);
      // Montar dados para atualizar (remover _id, criadoEm, odontograma, caso)
      const { _id, criadoEm, odontograma, caso, ...dadosAtualizar } = formData;

      await atualizarVitima(vitimaId as string, dadosAtualizar);
      setEditing(false);
      Alert.alert("Sucesso", "Vítima atualizada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Erro ao atualizar vítima");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!vitimaId) return;

    try {
      await deletarVitima(vitimaId as string);
      Alert.alert("Sucesso", "Vítima excluída com sucesso!");
      // Navega de volta para a lista de vítimas do caso
      router.back();
    } catch (error) {
      console.error("Erro ao deletar vítima:", error);
      Alert.alert(
        "Erro",
        "Não foi possível excluir a vítima. Tente novamente."
      );
    } finally {
      setShowDeleteModal(false);
    }
  };

  const formatarCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarData = (data: string) => {
    if (!data) return "";
    try {
      const date = new Date(data);
      return date.toLocaleDateString("pt-BR");
    } catch {
      return data;
    }
  };

  const formatarDataHora = (data: string) => {
    if (!data) return "";
    try {
      const date = new Date(data);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return data;
    }
  };

  const getSexoIcon = (sexo: string) => {
    switch (sexo) {
      case "Masculino":
        return "male";
      case "Feminino":
        return "female";
      default:
        return "person";
    }
  };

  const navegarParaOdontograma = (odontogramaId?: string) => {
    if (odontogramaId) {
      // Navegar para odontograma específico (visualização)
      router.push(
        `/caso/${casoId}/vitima/${vitimaId}/odontograma?id=${odontogramaId}`
      );
    } else {
      // Navegar para criar novo odontograma
      router.push(`/caso/${casoId}/vitima/${vitimaId}/odontograma`);
    }
  };

  if (loading || !formData) {
    return (
      <View className="flex-1 bg-dentfyGray900">
        <HeaderPerito showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextSecondary mt-4">
            Carregando vítima...
          </Body>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.dentfyAmber]}
            tintColor={colors.dentfyAmber}
            progressBackgroundColor={colors.dentfyGray800}
            progressViewOffset={10}
          />
        }
      >
        {/* Header da Vítima */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <View className="flex-row items-center mb-2">
                <Heading size="large" className="text-dentfyAmber">
                  {editing ? "Editar Vítima" : formData.nomeCompleto}
                </Heading>
                {refreshing && (
                  <ActivityIndicator
                    size="small"
                    color={colors.dentfyAmber}
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>
              <Body className="text-dentfyTextSecondary">
                {editing
                  ? "Atualize os dados da vítima abaixo."
                  : refreshing
                  ? "Atualizando dados..."
                  : "Detalhes da vítima"}
              </Body>
            </View>

            <View className="flex-row items-center gap-2">
              {!editing && (
                <>
                  <TouchableOpacity
                    onPress={() => navegarParaOdontograma()}
                    className="flex-row items-center px-4 py-2 bg-dentfyCyan rounded-lg border border-dentfyCyan"
                  >
                    <Image
                      source={require("@/assets/logo.png")}
                      style={{ width: 16, height: 16, marginRight: 6 }}
                      resizeMode="contain"
                    />
                    <Body className="text-white font-semibold">
                      Odontograma
                    </Body>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setEditing(true)}
                    className="p-3 rounded-full bg-dentfyAmber/10"
                  >
                    <Ionicons
                      name="pencil"
                      size={20}
                      color={colors.dentfyAmber}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleDelete}
                    className="p-3 rounded-full bg-errorRed/10"
                  >
                    <Ionicons name="trash" size={20} color={colors.errorRed} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {editing ? (
          /* Formulário de Edição */
          <View className="space-y-4">
            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Nome Completo *
              </Body>
              <TextInput
                value={formData.nomeCompleto}
                onChangeText={(value) => handleChange("nomeCompleto", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o nome completo"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Data de nascimento *
              </Body>
              <TextInput
                value={formData.dataNascimento}
                onChangeText={(value) => handleChange("dataNascimento", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Sexo *
              </Body>
              <View className="flex-row gap-4">
                {["Masculino", "Feminino", "Outro"].map((sexo) => (
                  <TouchableOpacity
                    key={sexo}
                    onPress={() => handleChange("sexo", sexo as Sexo)}
                    className={`flex-1 p-3 rounded-lg border ${
                      formData.sexo === sexo
                        ? "bg-dentfyAmber border-amber-500"
                        : "bg-dentfyGray800 border-dentfyGray700"
                    }`}
                  >
                    <Body
                      className={`text-center ${
                        formData.sexo === sexo
                          ? "text-white"
                          : "text-dentfyTextSecondary"
                      }`}
                    >
                      {sexo}
                    </Body>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Etnia *
              </Body>
              <View className="flex-row flex-wrap gap-2">
                {["Preto", "Pardo", "Branco", "Amarelo", "Indígena"].map(
                  (etnia) => (
                    <TouchableOpacity
                      key={etnia}
                      onPress={() => handleChange("etnia", etnia as Etnia)}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.etnia === etnia
                          ? "bg-dentfyAmber border-amber-500"
                          : "bg-dentfyGray800 border-dentfyGray700"
                      }`}
                    >
                      <Body
                        className={`text-center ${
                          formData.etnia === etnia
                            ? "text-white"
                            : "text-dentfyTextSecondary"
                        }`}
                      >
                        {etnia}
                      </Body>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Endereço *
              </Body>
              <TextInput
                value={formData.endereco}
                onChangeText={(value) => handleChange("endereco", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o endereço completo"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={2}
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                CPF *
              </Body>
              <TextInput
                value={formData.cpf}
                onChangeText={(value) =>
                  handleChange("cpf", value.replace(/\D/g, ""))
                }
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o CPF"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                maxLength={11}
              />
            </View>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={() => setEditing(false)}
                className="flex-1 p-4 bg-dentfyGray800 rounded-lg border border-dentfyGray700"
              >
                <Body className="text-center text-dentfyTextSecondary">
                  Cancelar
                </Body>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={saving}
                className="flex-1 p-4 bg-dentfyAmber rounded-lg"
              >
                <Body className="text-center text-white">
                  {saving ? "Salvando..." : "Salvar"}
                </Body>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Visualização dos Detalhes */
          <View className="space-y-4">
            {/* Informações Pessoais */}
            <View className="bg-dentfyGray800/30 p-4 rounded-lg">
              <View className="flex-row items-center mb-3">
                <Ionicons
                  name="person-circle"
                  size={24}
                  color={colors.dentfyAmber}
                />
                <Heading size="medium" className="text-dentfyTextPrimary ml-2">
                  Informações Pessoais
                </Heading>
              </View>

              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons
                    name="card-outline"
                    size={20}
                    color={colors.dentfyTextSecondary}
                  />
                  <Body className="text-dentfyAmber ml-3 mr-2 font-semibold">
                    CPF:
                  </Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formatarCPF(formData.cpf)}
                  </Body>
                </View>

                <View className="flex-row items-center">
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.dentfyTextSecondary}
                  />
                  <Body className="text-dentfyAmber ml-3 mr-2 font-semibold">
                    Data de Nascimento:
                  </Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formatarData(formData.dataNascimento)}
                  </Body>
                </View>

                <View className="flex-row items-center">
                  <Ionicons
                    name={getSexoIcon(formData.sexo)}
                    size={20}
                    color={colors.dentfyTextSecondary}
                  />
                  <Body className="text-dentfyAmber ml-3 mr-2 font-semibold">
                    Sexo:
                  </Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formData.sexo}
                  </Body>
                </View>

                <View className="flex-row items-center">
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={colors.dentfyTextSecondary}
                  />
                  <Body className="text-dentfyAmber ml-3 mr-2 font-semibold">
                    Etnia:
                  </Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formData.etnia}
                  </Body>
                </View>

                <View className="flex-row items-center">
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={colors.dentfyTextSecondary}
                  />
                  <Body className="text-dentfyAmber ml-3 mr-2 font-semibold">
                    Criado em:
                  </Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formatarData(formData.criadoEm)}
                  </Body>
                </View>
              </View>
            </View>

            {/* Odontogramas */}
            <View className="bg-dentfyGray800/30 p-4 rounded-lg">
              <View className="flex-row items-center mb-4">
                <View className="flex-row items-center">
                  <Ionicons
                    name="medical"
                    size={24}
                    color={colors.dentfyAmber}
                  />
                  <Heading
                    size="medium"
                    className="text-dentfyTextPrimary ml-2"
                  >
                    Odontogramas
                  </Heading>
                </View>
              </View>

              {Object.keys(dentesAvariados).length > 0 ? (
                <View className="items-center mt-4">
                  <View style={{ position: "relative" }}>
                    <Image
                      source={require("@/assets/odontograma.webp")}
                      style={{
                        width: imageWidth,
                        height: imageHeight,
                        borderRadius: 12,
                      }}
                      resizeMode="contain"
                    />

                    {/* Aqui chamamos a função corretamente para gerar o mapa de coordenadas */}
                    {(() => {
                      const mapaCoordenadas = getMapaCoordenadas(
                        imageWidth,
                        imageHeight
                      );
                      return Object.entries(dentesAvariados).map(
                        ([numero, tipo]) => {
                          const pos = mapaCoordenadas[numero];
                          return pos ? (
                            <TouchableOpacity
                              key={numero}
                              style={{
                                position: "absolute",
                                top: pos.top - 8,
                                left: pos.left - 8,
                                backgroundColor: "rgba(0, 0, 0, 0.1)",
                                borderRadius: 12,
                                padding: 1,
                              }}
                            >
                              {renderIcon(tipo, 14)}
                            </TouchableOpacity>
                          ) : null;
                        }
                      );
                    })()}
                  </View>
                </View>
              ) : (
                <View className="items-center py-8">
                  <Ionicons
                    name="medical-outline"
                    size={48}
                    color={colors.dentfyTextSecondary}
                  />
                  <Body className="text-dentfyTextSecondary text-center mt-3">
                    Nenhum odontograma registrado
                  </Body>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal de Confirmação de Delete */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
        statusBarTranslucent
      >
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0.5)"
          barStyle="light-content"
        />
        <Pressable
          onPress={() => setShowDeleteModal(false)}
          className="flex-1 bg-black/50"
        >
          <View className="flex-1 items-center justify-center p-4">
            <View className="bg-dentfyGray800 rounded-2xl p-6 w-full max-w-sm border border-dentfyGray700">
              {/* Ícone de Aviso */}
              <View className="items-center mb-4">
                <View className="w-16 h-16 bg-errorRed/20 rounded-full items-center justify-center mb-3">
                  <Ionicons name="warning" size={32} color={colors.errorRed} />
                </View>
                <Heading
                  size="medium"
                  className="text-dentfyTextPrimary text-center"
                >
                  Deletar Vítima
                </Heading>
              </View>

              {/* Mensagem */}
              <Body className="text-dentfyTextSecondary text-center mb-6 leading-6">
                Tem certeza que deseja deletar esta vítima? Esta ação não pode
                ser desfeita.
              </Body>

              {/* Botões */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  className="flex-1 p-4 bg-dentfyGray700 rounded-lg border border-dentfyGray600"
                >
                  <Body className="text-center text-dentfyTextSecondary font-medium">
                    Cancelar
                  </Body>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={confirmDelete}
                  className="flex-1 p-4 bg-errorRed rounded-lg"
                >
                  <Body className="text-center text-white font-medium">
                    Deletar
                  </Body>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
