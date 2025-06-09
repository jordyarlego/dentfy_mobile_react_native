"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Heading, Body } from "../../components/Typography";
import HeaderPerito from "../../components/header";
import { useToast } from "../../contexts/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import type { CasoData, CasoStatusAPI } from "../../components/CaseCard";
import { criarCaso } from "../../services/caso";
import type { CasoCreateData } from "../../app/(app)/casos";
import { colors } from "../../theme/colors";

const ModalDatePicker = ({
  visible,
  onClose,
  value,
  onChange,
}: {
  visible: boolean;
  onClose: () => void;
  value: Date;
  onChange: (date: Date) => void;
}) => {
  if (Platform.OS === "ios") {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-overlayBlack justify-end">
          <View className="bg-dentfyGray800 rounded-t-2xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Heading size="medium" className="text-dentfyTextPrimary">
                Selecione a Data
              </Heading>
              <TouchableOpacity onPress={onClose}>
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.dentfyTextSecondary}
                />
              </TouchableOpacity>
            </View>

            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              onChange={(_, date) => date && onChange(date)}
              maximumDate={new Date()}
              locale="pt-BR"
              textColor={colors.dentfyAmber}
              style={{ backgroundColor: colors.dentfyGray800 }}
            />

            <TouchableOpacity
              onPress={onClose}
              className="mt-4 p-3 bg-dentfyAmber rounded-lg"
            >
              <Body className="text-white text-center">Confirmar</Body>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return visible ? (
    <DateTimePicker
      value={value}
      mode="date"
      display="default"
      onChange={(_, date) => {
        onClose();
        date && onChange(date);
      }}
      maximumDate={new Date()}
      locale="pt-BR"
    />
  ) : null;
};

export default function NovoCaso() {
  const router = useRouter();
  const { showToast } = useToast();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Função para ajustar o fuso horário
  const adjustDateForTimezone = (date: Date) => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset);
  };

  const [formData, setFormData] = useState<CasoCreateData>({
    titulo: "",
    descricao: "",
    responsavel: "",
    status: "Em andamento" as CasoStatusAPI,
    tipo: "Vitima",
    dataAbertura: adjustDateForTimezone(new Date()).toISOString().split("T")[0],
    sexo: "Masculino",
    local: "",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof CasoCreateData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    const adjustedDate = adjustDateForTimezone(date);
    const formattedDate = adjustedDate.toISOString().split("T")[0];
    handleChange("dataAbertura", formattedDate);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!formData.titulo.trim()) {
      setError("O título é obrigatório");
      return;
    }
    if (!formData.descricao.trim()) {
      setError("A descrição é obrigatória");
      return;
    }
    if (!formData.responsavel.trim()) {
      setError("O responsável é obrigatório");
      return;
    }
    if (!formData.local.trim()) {
      setError("O local é obrigatório");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Token de autenticação não encontrado.");
        return;
      }

      await criarCaso(formData, token);

      showToast("Caso criado com sucesso!", "success");
      router.push("/casos");
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro inesperado ao criar caso.");
      }
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito showBackButton />

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Heading size="large" className="text-gray-100 mb-2">
            Novo Caso
          </Heading>
          <Body className="text-gray-400">
            Preencha os dados do novo caso odontolegal
          </Body>
        </View>

        <View className="space-y-4">
          {/* Título */}
          <View>
            <Body className="text-amber-500 mb-2">Título</Body>
            <TextInput
              value={formData.titulo}
              onChangeText={(value) => handleChange("titulo", value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30"
              placeholder="Digite o título do caso"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Data de Abertura */}
          <View>
            <Body className="text-amber-500 mb-2">Data de Abertura</Body>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-amber-500/30 flex-row justify-between items-center"
            >
              <Body className="text-gray-100">
                {new Date(
                  formData.dataAbertura + "T00:00:00"
                ).toLocaleDateString("pt-BR")}
              </Body>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.dentfyAmber}
              />
            </TouchableOpacity>

            <ModalDatePicker
              visible={showDatePicker}
              onClose={() => setShowDatePicker(false)}
              value={selectedDate}
              onChange={handleDateChange}
            />
          </View>

          {/* Local */}
          <View>
            <Body className="text-amber-500 mb-2">Local</Body>
            <TextInput
              value={formData.local}
              onChangeText={(value) => handleChange("local", value)}
              className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-amber-500/30"
              placeholder="Digite o local do caso"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Responsável */}
          <View>
            <Body className="text-dentfyAmber mb-2">Responsável</Body>
            <TextInput
              value={formData.responsavel}
              onChangeText={(value) => handleChange("responsavel", value)}
              className="w-full px-4 py-2 bg-dentfyGray800 text-dentfyTextPrimary rounded-lg border border-dentfyAmber/30"
              placeholder="Digite o nome do responsável"
              placeholderTextColor={colors.dentfyTextSecondary}
            />
          </View>

          {/* Descrição */}
          <View>
            <Body className="text-dentfyAmber mb-2">Descrição</Body>
            <TextInput
              value={formData.descricao}
              onChangeText={(value) => handleChange("descricao", value)}
              className="w-full px-4 py-2 bg-dentfyGray800 text-dentfyTextPrimary rounded-lg border border-dentfyAmber/30 min-h-[100px]"
              placeholder="Digite a descrição do caso"
              placeholderTextColor={colors.dentfyTextSecondary}
              multiline
              textAlignVertical="top"
            />
          </View>

          {error && (
            <View className="p-3 bg-errorRed/10 border border-errorRed/30 rounded-lg">
              <Body className="text-errorRed">{error}</Body>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View className="p-4 border-t border-gray-800 bg-gray-900">
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 p-3 rounded-lg border border-gray-700"
          >
            <Body className="text-gray-400 text-center">Cancelar</Body>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 p-3 bg-amber-600 rounded-lg"
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Body className="text-white ml-2">Salvar Caso</Body>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
