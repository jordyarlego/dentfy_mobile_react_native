import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';

interface Props {
  casosEmAndamento: number;
  casosFinalizados: number;
  casosArquivados: number;
  isLoading: boolean;
}

export default function DashboardPeritoDistribuicao({
  casosEmAndamento,
  casosFinalizados,
  casosArquivados,
  isLoading,
}: Props) {
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 400;
  
  // Ajusta o tamanho baseado na tela
  const chartWidth = isSmallScreen ? screenWidth - 32 : screenWidth - 64;
  const chartHeight = isSmallScreen ? 200 : 250;

  const data = [
    {
      name: 'Em Andamento',
      quantidade: casosEmAndamento,
      color: colors.dentfyAmber,
      legendFontColor: colors.dentfyTextSecondary,
      legendFontSize: isSmallScreen ? 10 : 12,
    },
    {
      name: 'Finalizados',
      quantidade: casosFinalizados,
      color: colors.dentfyCyan,
      legendFontColor: colors.dentfyTextSecondary,
      legendFontSize: isSmallScreen ? 10 : 12,
    },
    {
      name: 'Arquivados',
      quantidade: casosArquivados,
      color: colors.dentfyGray500,
      legendFontColor: colors.dentfyTextSecondary,
      legendFontSize: isSmallScreen ? 10 : 12,
    },
  ];

  if (isLoading) {
    return (
      <View className={`h-[${chartHeight}px] items-center justify-center`}>
        <View className="w-16 h-16 bg-dentfyAmber/20 rounded-full items-center justify-center mb-3 animate-pulse">
          <Text className="text-dentfyAmber text-2xl">📊</Text>
        </View>
        <Text className="text-dentfyTextSecondary">Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <PieChart
        data={data}
        width={chartWidth}
        height={chartHeight}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          color: (opacity = 1) => `${colors.dentfyTextPrimary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          labelColor: (opacity = 1) => `${colors.dentfyTextSecondary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="quantidade"
        backgroundColor="transparent"
        paddingLeft={isSmallScreen ? "10" : "15"}
        hasLegend={true}
        avoidFalseZero={true}
      />
    </View>
  );
} 