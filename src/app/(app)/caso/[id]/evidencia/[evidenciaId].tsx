import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Body } from "@/components/Typography";
import { colors } from "@/theme/colors";
import type { Evidencia, Caso, TipoEvidencia } from "@/types/caso";
import {
  buscarEvidenciasPorCaso,
  atualizarEvidencia,
} from "@/services/api_evidencia";

export default function EditarEvidencia() {
  const { id, evidenciaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Evidencia | null>(null);

  useEffect(() => {
    carregarEvidencia();
  }, [id, evidenciaId]);

  const carregarEvidencia = async () => {
    try {
      const evidencias = await buscarEvidenciasPorCaso(String(id));
      const evidencia = evidencias.find(
        (e) => String(e._id) === String(evidenciaId)
      );

      if (!evidencia) {
        throw new Error("Evidência não encontrada");
      }

      setFormData(evidencia);
    } catch (error) {
      console.error("Erro ao carregar evidência:", error);
      Alert.alert("Erro", "Erro ao carregar evidência");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof Evidencia,
    value: string | TipoEvidencia
  ) => {
    if (!formData) return;
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setSaving(true);

      // Validar campos obrigatórios
      const camposObrigatorios = [
        "titulo",
        "descricao",
        "tipo",
        "coletadaPor",
        "dataColeta",
        "local",
      ];

      const camposFaltantes = camposObrigatorios.filter(
        (campo) => !formData[campo]
      );

      if (camposFaltantes.length > 0) {
        Alert.alert(
          "Campos obrigatórios",
          "Por favor, preencha todos os campos obrigatórios."
        );
        return;
      }

      await atualizarEvidencia(String(evidenciaId), formData);

      Alert.alert("Sucesso", "Evidência atualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Erro ao atualizar evidência:", error);
      Alert.alert("Erro", "Erro ao atualizar evidência");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />

      {loading || !formData ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextSecondary mt-4">Carregando...</Body>
        </View>
      ) : (
        <ScrollView className="flex-1 p-4">
          <View className="mb-6">
            <Body className="text-2xl font-bold text-dentfyAmber mb-2">
              Editar Evidência
            </Body>
            <Body className="text-base text-dentfyTextSecondary">
              Atualize os dados da evidência abaixo.
            </Body>
          </View>

          <View className="space-y-4">
            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Título *
              </Body>
              <TextInput
                value={formData.titulo}
                onChangeText={(value) => handleChange("titulo", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o título"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Descrição *
              </Body>
              <TextInput
                value={formData.descricao}
                onChangeText={(value) => handleChange("descricao", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite a descrição"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={4}
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Tipo *
              </Body>
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => handleChange("tipo", "imagem")}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.tipo === "imagem"
                      ? "bg-dentfyAmber border-amber-500"
                      : "bg-dentfyGray800 border-dentfyGray700"
                  }`}
                >
                  <Body
                    className={`text-center ${
                      formData.tipo === "imagem"
                        ? "text-white"
                        : "text-dentfyTextSecondary"
                    }`}
                  >
                    Imagem
                  </Body>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChange("tipo", "documento")}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.tipo === "documento"
                      ? "bg-dentfyAmber border-amber-500"
                      : "bg-dentfyGray800 border-dentfyGray700"
                  }`}
                >
                  <Body
                    className={`text-center ${
                      formData.tipo === "documento"
                        ? "text-white"
                        : "text-dentfyTextSecondary"
                    }`}
                  >
                    Documento
                  </Body>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Coletada por *
              </Body>
              <TextInput
                value={formData.coletadaPor}
                onChangeText={(value) => handleChange("coletadaPor", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o nome do coletor"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Data de coleta *
              </Body>
              <TextInput
                value={formData.dataColeta}
                onChangeText={(value) => handleChange("dataColeta", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">
                Local *
              </Body>
              <TextInput
                value={formData.local}
                onChangeText={(value) => handleChange("local", value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o local"
                placeholderTextColor="#6B7280"
              />
            </View>
          </View>

          <View className="flex-row gap-4 mt-6">
            <TouchableOpacity
              onPress={() => router.back()}
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
        </ScrollView>
      )}
    </View>
  );
}
