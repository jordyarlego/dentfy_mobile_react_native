import React, { useState, useCallback } from "react";
import { View, ScrollView, ActivityIndicator, RefreshControl, Animated } from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const {
    casosEmAndamento,
    casosFinalizados,
    casosArquivados,
    isLoading: isLoadingResumo,
    refetch: refetchResumo,
  } = useResumoDashboard(filtroPeriodo, filtroSexo, filtroEtnia);

  const { casosPorTipo, isLoading: isLoadingTipos, refetch: refetchTipos } = useCasosPorTipo(
    filtroPeriodo,
    filtroSexo,
    filtroEtnia
  );

  const totalCasos = casosEmAndamento + casosFinalizados + casosArquivados;

  // Efeito de fade in
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchResumo(), refetchTipos()]);
    } catch (error) {
      console.error('Erro ao atualizar dashboard:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchResumo, refetchTipos]);

  if (isLoadingResumo || isLoadingTipos) {
    return (
      <View className="flex-1 justify-center items-center bg-dentfyGray900">
        <ActivityIndicator size="large" color={colors.dentfyAmber} />
        <Body className="text-dentfyTextSecondary mt-4">Carregando dashboard...</Body>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dentfyGray900">
      <HeaderPerito />

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.dentfyAmber}
            colors={[colors.dentfyAmber]}
            progressBackgroundColor={colors.dentfyGray800}
          />
        }
      >
        <Animated.View 
          className="p-6 space-y-6"
          style={{
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }}
        >
          {/* Header do Dashboard */}
          <View className="mb-6">
            <Heading size="large" className="text-dentfyTextPrimary mb-2">
              Dashboard do Perito
            </Heading>
            <Body className="text-dentfyTextSecondary">
              Visão geral dos seus casos e estatísticas
            </Body>
          </View>

          {/* Cards de Status */}
          <View className="space-y-4">
            <Heading size="medium" className="text-dentfyTextPrimary mb-3">
              Resumo Geral
            </Heading>
            
            <View className="flex-row flex-wrap gap-4">
              {/* Card Total de Casos */}
              <Animated.View className="flex-1 min-w-[160px] bg-gradient-to-br from-dentfyMediumBlue to-dentfyDarkBlue p-5 rounded-2xl border border-dentfyGray700/50">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-12 h-12 bg-dentfyAmber/20 rounded-xl items-center justify-center">
                    <FontAwesome5 name="folder" size={20} color={colors.dentfyAmber} />
                  </View>
                  <View className="items-end">
                    <Body className="text-dentfyTextSecondary text-xs mb-1">
                      Total
                    </Body>
                    <Heading size="large" className="text-dentfyTextPrimary">
                      {totalCasos}
                    </Heading>
                  </View>
                </View>
                <Body className="text-dentfyTextSecondary text-sm">
                  Casos registrados
                </Body>
              </Animated.View>

              {/* Card Em Andamento */}
              <Animated.View className="flex-1 min-w-[160px] bg-gradient-to-br from-dentfyMediumBlue to-dentfyDarkBlue p-5 rounded-2xl border border-dentfyGray700/50">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-12 h-12 bg-dentfyAmber/20 rounded-xl items-center justify-center">
                    <MaterialIcons name="access-time" size={20} color={colors.dentfyAmber} />
                  </View>
                  <View className="items-end">
                    <Body className="text-dentfyTextSecondary text-xs mb-1">
                      Ativos
                    </Body>
                    <Heading size="large" className="text-dentfyTextPrimary">
                      {casosEmAndamento}
                    </Heading>
                  </View>
                </View>
                <Body className="text-dentfyTextSecondary text-sm">
                  Em andamento
                </Body>
              </Animated.View>

              {/* Card Finalizados */}
              <Animated.View className="flex-1 min-w-[160px] bg-gradient-to-br from-dentfyMediumBlue to-dentfyDarkBlue p-5 rounded-2xl border border-dentfyGray700/50">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-12 h-12 bg-dentfyCyan/20 rounded-xl items-center justify-center">
                    <MaterialIcons name="check-circle" size={20} color={colors.dentfyCyan} />
                  </View>
                  <View className="items-end">
                    <Body className="text-dentfyTextSecondary text-xs mb-1">
                      Concluídos
                    </Body>
                    <Heading size="large" className="text-dentfyTextPrimary">
                      {casosFinalizados}
                    </Heading>
                  </View>
                </View>
                <Body className="text-dentfyTextSecondary text-sm">
                  Finalizados
                </Body>
              </Animated.View>

              {/* Card Arquivados */}
              <Animated.View className="flex-1 min-w-[160px] bg-gradient-to-br from-dentfyMediumBlue to-dentfyDarkBlue p-5 rounded-2xl border border-dentfyGray700/50">
                <View className="flex-row items-center justify-between mb-3">
                  <View className="w-12 h-12 bg-dentfyGray600/20 rounded-xl items-center justify-center">
                    <MaterialCommunityIcons name="archive" size={20} color={colors.dentfyGray500} />
                  </View>
                  <View className="items-end">
                    <Body className="text-dentfyTextSecondary text-xs mb-1">
                      Arquivados
                    </Body>
                    <Heading size="large" className="text-dentfyTextPrimary">
                      {casosArquivados}
                    </Heading>
                  </View>
                </View>
                <Body className="text-dentfyTextSecondary text-sm">
                  Arquivados
                </Body>
              </Animated.View>
            </View>
          </View>

          {/* Seção de Gráficos */}
          <View className="space-y-6">
            <View className="flex-row items-center justify-between">
              <Heading size="medium" className="text-dentfyTextPrimary">
                Análises e Gráficos
              </Heading>
              <View className="flex-row items-center gap-2">
                <View className="w-3 h-3 bg-dentfyAmber rounded-full animate-pulse"></View>
                <Body className="text-dentfyTextSecondary text-sm">
                  Dados em tempo real
                </Body>
              </View>
            </View>

            {/* Gráfico de Distribuição */}
            <Animated.View 
              className="bg-gradient-to-br from-dentfyGray800/50 to-dentfyGray800/30 p-6 rounded-2xl border border-dentfyGray700/30"
            >
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-dentfyAmber/20 rounded-xl items-center justify-center mr-3">
                  <MaterialIcons name="pie-chart" size={20} color={colors.dentfyAmber} />
                </View>
                <Heading size="medium" className="text-dentfyTextPrimary">
                  Distribuição dos Casos
                </Heading>
              </View>
              <DashboardPeritoDistribuicao
                casosEmAndamento={casosEmAndamento}
                casosFinalizados={casosFinalizados}
                casosArquivados={casosArquivados}
                isLoading={isLoadingResumo}
              />
            </Animated.View>

            {/* Gráfico de Casos Mensais */}
            <Animated.View 
              className="bg-gradient-to-br from-dentfyGray800/50 to-dentfyGray800/30 p-6 rounded-2xl border border-dentfyGray700/30"
            >
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-dentfyCyan/20 rounded-xl items-center justify-center mr-3">
                  <MaterialIcons name="bar-chart" size={20} color={colors.dentfyCyan} />
                </View>
                <Heading size="medium" className="text-dentfyTextPrimary">
                  Casos por Tipo
                </Heading>
              </View>
              <DashboardPeritoCasosMensais
                casos={casosPorTipo}
                isLoading={isLoadingTipos}
              />
            </Animated.View>
          </View>

          {/* Footer com Informações */}
          <Animated.View 
            className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/20"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-2 h-2 bg-dentfyCyan rounded-full animate-pulse"></View>
                <Body className="text-dentfyTextSecondary text-sm">
                  Sistema atualizado
                </Body>
              </View>
              <Body className="text-dentfyTextSecondary text-xs">
                Última atualização: {new Date().toLocaleTimeString('pt-BR')}
              </Body>
            </View>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
