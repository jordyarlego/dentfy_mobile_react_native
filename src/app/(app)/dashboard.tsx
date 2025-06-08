import React, { useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HeaderPerito from "../../components/header";
import {
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import DashboardPeritoDistribuicao from "../../components/dashboard/DashboardPeritoDistribuicao";
import DashboardPeritoCasosMensais from "../../components/dashboard/DashboardPeritoCasosMensais";
import {
  useResumoDashboard,
  useCasosPorTipo,
} from "../../services/api_dashboard";
import { Body, Heading } from "../../components/Typography";
import { colors } from "../../theme/colors";

export default function Dashboard() {
  const [filtroPeriodo, setFiltroPeriodo] = useState("todos");
  const [filtroSexo, setFiltroSexo] = useState("todos");
  const [filtroEtnia, setFiltroEtnia] = useState("todos");

  const {
    casosEmAndamento,
    casosFinalizados,
    casosArquivados,
    isLoading: isLoadingResumo,
  } = useResumoDashboard(filtroPeriodo, filtroSexo, filtroEtnia);

  const { casosPorTipo, isLoading: isLoadingTipos } = useCasosPorTipo(
    filtroPeriodo,
    filtroSexo,
    filtroEtnia
  );

  const totalCasos = casosEmAndamento + casosFinalizados + casosArquivados;

  if (isLoadingResumo || isLoadingTipos) {
    return (
      <View className="flex-1 justify-center items-center bg-[#0E1A26]">
        <ActivityIndicator size="large" color={colors.dentfyAmber} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0E1A26]">
      <HeaderPerito />

      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          <Heading size="large" className="text-amber-100 mb-4">
            Dashboard do Perito
          </Heading>

          {/* Cards de Status */}
          <View className="flex-row flex-wrap gap-2">
            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Body className="text-amber-100/70 text-xs">
                    Total de Casos
                  </Body>
                  <Heading size="medium" className="text-amber-100">
                    {totalCasos}
                  </Heading>
                </View>
                <FontAwesome5 name="folder" size={24} color="#f59e0b" />
              </View>
            </View>

            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Body className="text-amber-100/70 text-xs">
                    Em Andamento
                  </Body>
                  <Heading size="medium" className="text-amber-100">
                    {casosEmAndamento}
                  </Heading>
                </View>
                <MaterialIcons name="access-time" size={24} color="#facc15" />
              </View>
            </View>

            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Body className="text-amber-100/70 text-xs">Finalizados</Body>
                  <Heading size="medium" className="text-amber-100">
                    {casosFinalizados}
                  </Heading>
                </View>
                <MaterialIcons name="check-circle" size={24} color="#22c55e" />
              </View>
            </View>

            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Body className="text-amber-100/70 text-xs">Arquivados</Body>
                  <Heading size="medium" className="text-amber-100">
                    {casosArquivados}
                  </Heading>
                </View>
                <MaterialCommunityIcons
                  name="archive"
                  size={24}
                  color="#a78bfa"
                />
              </View>
            </View>
          </View>

          {/* Gráficos */}
          <View className="space-y-4">
            <Body className="text-base font-semibold text-amber-100">
              Distribuição dos Casos
            </Body>
            <DashboardPeritoDistribuicao
              casosEmAndamento={casosEmAndamento}
              casosFinalizados={casosFinalizados}
              casosArquivados={casosArquivados}
              isLoading={isLoadingResumo}
            />
            <DashboardPeritoCasosMensais
              casos={casosPorTipo}
              isLoading={isLoadingTipos}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
