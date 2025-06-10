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
  const screenWidth = Dimensions.get('window').width - 64; // Ajustado para o novo padding

  const data = [
    {
      name: 'Em Andamento',
      quantidade: casosEmAndamento,
      color: colors.dentfyAmber,
      legendFontColor: colors.dentfyTextSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Finalizados',
      quantidade: casosFinalizados,
      color: colors.dentfyCyan,
      legendFontColor: colors.dentfyTextSecondary,
      legendFontSize: 12,
    },
    {
      name: 'Arquivados',
      quantidade: casosArquivados,
      color: colors.dentfyGray500,
      legendFontColor: colors.dentfyTextSecondary,
      legendFontSize: 12,
    },
  ];

  if (isLoading) {
    return (
      <View className="h-[200px] items-center justify-center">
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
        width={screenWidth}
        height={200}
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
        paddingLeft="15"
        absolute
        hasLegend={true}
        center={[screenWidth / 2, 100]}
        avoidFalseZero={true}
      />
    </View>
  );
} 