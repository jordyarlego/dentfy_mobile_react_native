"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  RefreshControl,
  Modal,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { Heading, Body } from "../../components/Typography";
import { useToast } from "../../contexts/ToastContext";
import { colors } from "../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import HeaderPerito from "../../components/header";
import { useRouter } from "expo-router";
import { buscarCasos, buscarCasoCompleto } from "../../services/caso";
import type {
  CasoData,
  CasoStatusAPI,
  CasoStatusFrontend,
} from "../../components/CaseCard";
import { CaseCard, convertStatusToFrontend } from "../../components/CaseCard";
//import ModalDetalhesCaso from "../../components/caso/ModalDetalhesCaso";
import type { Caso } from "../../types/caso";
import { convertCasoDataToCaso } from "../../utils/caso";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipos
export type CasoCreateData = Omit<CasoData, "_id" | "dataFechamento"> & {
  dataFechamento?: string;
};

type FiltroPeriodo = "todos" | "semana" | "mes" | "ano";
type FiltroStatus = "todos" | CasoStatusFrontend;

// Constantes
const FILTROS_PERIODO = [
  { id: "todos" as const, label: "Todos" },
  { id: "semana" as const, label: "Última-Semana" },
  { id: "mes" as const, label: "Este Mês" },
  { id: "ano" as const, label: "Este Ano" },
];

const FILTROS_STATUS = [
  { id: "todos" as const, label: "Todos" },
  { id: "em_andamento" as const, label: "Em andamento" },
  { id: "concluido" as const, label: "Concluído" },
  { id: "arquivado" as const, label: "Arquivado" },
];

// Componentes
const BarraPesquisa = ({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (text: string) => void;
}) => (
  <View className="mt-4 relative">
    <TextInput
      placeholder="Pesquisar casos..."
      value={search}
      onChangeText={setSearch}
      placeholderTextColor={colors.dentfyTextSecondary}
      className="w-full px-4 py-2 bg-dentfyGray800/80 text-dentfyTextPrimary rounded-lg border border-dentfyBorderGray pr-10"
    />
    <View className="absolute right-3 top-3">
      <Ionicons name="search" size={20} color={colors.dentfyTextSecondary} />
    </View>
  </View>
);

const BarraAcoes = ({
  onFilterPress,
  onAddPress,
}: {
  onFilterPress: () => void;
  onAddPress: () => void;
}) => (
  <View className="flex-row gap-2">
    <TouchableOpacity
      onPress={onFilterPress}
      className="p-2 bg-dentfyGray800 rounded-lg border border-dentfyBorderGray"
    >
      <Ionicons name="filter" size={20} color={colors.dentfyTextSecondary} />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onAddPress}
      className="flex-row items-center gap-2 px-4 py-2 bg-dentfyAmber/10 rounded-lg border border-dentfyAmber/30"
    >
      <Ionicons
        name="add-circle-outline"
        size={20}
        color={colors.dentfyAmber}
      />
      <Body className="text-dentfyAmber">Novo Caso</Body>
    </TouchableOpacity>
  </View>
);

const ListaVazia = () => (
  <View className="flex-1 items-center justify-center p-8">
    <Ionicons
      name="document-text-outline"
      size={48}
      color={colors.dentfyTextSecondary}
    />
    <Body size="small" className="text-dentfyTextSecondary mt-4 text-center">
      Nenhum caso encontrado com os filtros selecionados.
    </Body>
  </View>
);

const ModalFiltros = ({
  visible,
  onClose,
  filtroPeriodo,
  setFiltroPeriodo,
  filtroStatus,
  setFiltroStatus,
}: {
  visible: boolean;
  onClose: () => void;
  filtroPeriodo: FiltroPeriodo;
  setFiltroPeriodo: (filtro: FiltroPeriodo) => void;
  filtroStatus: FiltroStatus;
  setFiltroStatus: (filtro: FiltroStatus) => void;
}) => (
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
            Filtros
          </Heading>
          <TouchableOpacity onPress={onClose}>
            <Ionicons
              name="close"
              size={24}
              color={colors.dentfyTextSecondary}
            />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Body className="text-dentfyTextSecondary mb-2">Período</Body>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {FILTROS_PERIODO.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setFiltroPeriodo(option.id)}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  filtroPeriodo === option.id
                    ? "bg-dentfyAmber/10 border-dentfyAmber/30"
                    : "border-dentfyBorderGray"
                }`}
              >
                <Body
                  className={
                    filtroPeriodo === option.id
                      ? "text-dentfyAmber"
                      : "text-dentfyTextSecondary"
                  }
                >
                  {option.label}
                </Body>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Body className="text-dentfyTextPrimary mb-2">Status</Body>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {FILTROS_STATUS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setFiltroStatus(option.id)}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  filtroStatus === option.id
                    ? "bg-dentfyAmber/10 border-dentfyAmber/30"
                    : "border-dentfyBorderGray"
                }`}
              >
                <Body
                  className={
                    filtroStatus === option.id
                      ? "text-dentfyAmber"
                      : "text-dentfyTextSecondary"
                  }
                >
                  {option.label}
                </Body>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  </Modal>
);

// Componente Principal
export default function Casos() {
  const router = useRouter();
  const { showToast } = useToast();
  const [casos, setCasos] = useState<CasoData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState<FiltroPeriodo>("todos");
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const loadCasos = useCallback(async () => {
    try {
      const data = await buscarCasos();
      if (Array.isArray(data)) {
        setCasos(data);
      } else {
        setCasos([]);
        showToast("Dados de casos inválidos", "error");
      }
    } catch (error) {
      setCasos([]);
      showToast("Erro ao carregar casos", "error");
    }
  }, [showToast]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCasos();
    setRefreshing(false);
  }, [loadCasos]);

  useEffect(() => {
    loadCasos();
  }, [loadCasos]);

  const filtrarCasos = useCallback(
    (caso: CasoData) => {
      if (!caso || !caso.titulo) return false;

      const nomeMatch = caso.titulo
        .toLowerCase()
        .includes(search.toLowerCase());
      const statusFrontend = convertStatusToFrontend(caso.status);
      const statusMatch =
        filtroStatus === "todos" || statusFrontend === filtroStatus;
      const data = new Date(caso.dataAbertura);
      const hoje = new Date();

      switch (filtroPeriodo) {
        case "semana":
          const diff = Math.abs(hoje.getTime() - data.getTime());
          const dias = diff / (1000 * 3600 * 24);
          return nomeMatch && statusMatch && dias <= 7;

        case "mes":
          return (
            nomeMatch &&
            statusMatch &&
            data.getMonth() === hoje.getMonth() &&
            data.getFullYear() === hoje.getFullYear()
          );

        case "ano":
          return (
            nomeMatch &&
            statusMatch &&
            data.getFullYear() === hoje.getFullYear()
          );

        default:
          return nomeMatch && statusMatch;
      }
    },
    [search, filtroStatus, filtroPeriodo]
  );

  const casosFiltrados = casos.filter(filtrarCasos);

  const handleCasePress = async (caseId: string) => {
    try {
      console.log("=== INÍCIO DO CARREGAMENTO DO CASO ===");
      console.log("ID do caso:", caseId);

      // Verificar token antes de fazer a requisição
      const token = await AsyncStorage.getItem("token");
      console.log(
        "Token antes da requisição:",
        token ? "Token presente" : "Token ausente"
      );

      console.log("Iniciando busca do caso completo...");
      const {
        caso: casoData,
        vitimas,
        evidencias,
        peritos,
      } = await buscarCasoCompleto(caseId);
      console.log("Dados recebidos da API:", {
        caso: casoData ? "Caso presente" : "Caso ausente",
        vitimas: vitimas?.length || 0,
        evidencias: evidencias?.length || 0,
        peritos: peritos?.length || 0,
      });

      console.log("Convertendo dados do caso...");
      const casoConvertido = convertCasoDataToCaso(
        casoData,
        vitimas,
        evidencias,
        peritos
      );
      console.log("Caso convertido:", {
        id: casoConvertido._id,
        titulo: casoConvertido.titulo,
        vitimas: casoConvertido.vitimas?.length || 0,
        evidencias: casoConvertido.evidencias?.length || 0,
        peritos: casoConvertido.peritos?.length || 0,
      });

      console.log("Atualizando estado...");
      router.push(`/caso/${casoConvertido._id}`);
      console.log("Estado atualizado com sucesso");

      console.log("=== FIM DO CARREGAMENTO DO CASO ===");
    } catch (error: any) {
      console.error("=== ERRO NO CARREGAMENTO DO CASO ===");
      console.error("Mensagem de erro:", error.message);
      console.error("Status da resposta:", error.response?.status);
      console.error("Dados da resposta:", error.response?.data);
      console.error("Headers da resposta:", error.response?.headers);
      console.error("Stack do erro:", error.stack);
      console.error("=== FIM DO ERRO ===");

      showToast("Erro ao carregar detalhes do caso", "error");
    }
  };

  const handleAddCase = () => {
    router.push("/novo-caso");
  };

  const handleAddVitima = () => {
    if (casos.length > 0) {
      router.push(`/caso/${casos[0]._id}/vitima/nova`);
    }
  };

  const handleAddEvidencia = () => {
    if (casos.length > 0) {
      router.push(`/caso/${casos[0]._id}/evidencia/nova`);
    }
  };

  const handleAddPerito = () => {
    if (casos.length > 0) {
      router.push(`/caso/${casos[0]._id}/perito/novo`);
    }
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarCasos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarCasos();
      console.log("Resposta da API (buscarCasos):", response);
      if (Array.isArray(response)) {
        setCasos(response);
      } else {
        console.error(
          "Formato inesperado da resposta da API (buscarCasos):",
          response
        );
        setError("Erro ao carregar casos: formato inesperado");
        setCasos([]);
      }
    } catch (err: any) {
      console.error("Erro ao buscar casos:", err);
      setError("Erro ao carregar casos.");
      setCasos([]);
      if (err.response && err.response.status === 401) {
        showToast("Sessão expirada. Faça login novamente.", "error");
        AsyncStorage.removeItem("token");
        router.replace("/");
      } else {
        showToast(err.message || "Erro ao carregar casos.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCasos();
  }, []);

  const filteredCasos = useMemo(() => {
    return casos.filter((caso) => {
      const matchesSearch =
        search === "" ||
        caso.titulo.toLowerCase().includes(search.toLowerCase()) ||
        caso.responsavel.toLowerCase().includes(search.toLowerCase()) ||
        caso.local.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        selectedStatus === null || caso.status === selectedStatus;
      const matchesType = selectedType === null || caso.tipo === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [casos, search, selectedStatus, selectedType]);

  const handleApplyFilters = (status: string | null, type: string | null) => {
    setSelectedStatus(status);
    setSelectedType(type);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSelectedStatus(null);
    setSelectedType(null);
    setShowFilters(false);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-dentfyDarkBlue">
        <ActivityIndicator size="large" color={colors.dentfyAmber} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-dentfyDarkBlue p-4">
        <Body className="text-errorRed mb-4">{error}</Body>
        <TouchableOpacity
          onPress={carregarCasos}
          className="bg-dentfyMediumBlue py-2 px-4 rounded"
        >
          <Body className="text-dentfyTextPrimary">Tentar Novamente</Body>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dentfyDarkBlue">
      <HeaderPerito />

      <View className="flex-1">
        <View className="p-4 border-b border-dentfyBorderGray">
          <View className="flex-row justify-between items-center">
            <Heading size="large" className="text-dentfyTextPrimary">
              Casos
            </Heading>
            <BarraAcoes
              onFilterPress={() => setShowFilters(true)}
              onAddPress={handleAddCase}
            />
          </View>

          <BarraPesquisa search={search} setSearch={setSearch} />
        </View>

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.dentfyAmber]}
              tintColor={colors.dentfyAmber}
            />
          }
        >
          {filteredCasos.length === 0 ? (
            <ListaVazia />
          ) : (
            filteredCasos.map((caso) => (
              <CaseCard
                key={caso._id}
                caso={caso}
                onPress={() => handleCasePress(caso._id)}
              />
            ))
          )}
        </ScrollView>

        <ModalFiltros
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          filtroPeriodo={filtroPeriodo}
          setFiltroPeriodo={setFiltroPeriodo}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
        />
      </View>
    </SafeAreaView>
  );
}
