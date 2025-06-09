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
  const screenWidth = Dimensions.get('window').width - 32; // 32 = padding do container

  const data = [
    {
      name: 'Em Andamento',
      quantidade: casosEmAndamento,
      color: colors.dentfyAmberLight,
      legendFontColor: colors.dentfyAmberLighter,
      legendFontSize: 12,
    },
    {
      name: 'Finalizados',
      quantidade: casosFinalizados,
      color: colors.successGreen,
      legendFontColor: colors.dentfyAmberLighter,
      legendFontSize: 12,
    },
    {
      name: 'Arquivados',
      quantidade: casosArquivados,
      color: colors.statusRed,
      legendFontColor: colors.dentfyAmberLighter,
      legendFontSize: 12,
    },
  ];

  if (isLoading) {
    return (
      <View className="bg-dentfyDarkBlue p-4 rounded-lg border border-dentfyCyan/30">
        <Text className="text-base font-semibold text-dentfyTextPrimary mb-3">
          Distribuição dos Casos
        </Text>
        <View className="h-[200px] items-center justify-center">
          <Text className="text-dentfyTextSecondary">Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-dentfyDarkBlue p-4 rounded-lg border border-dentfyCyan/30">
      <Text className="text-base font-semibold text-dentfyTextPrimary mb-3">
        Distribuição dos Casos
      </Text>
      <PieChart
        data={data}
        width={screenWidth}
        height={200}
        chartConfig={{
          backgroundColor: colors.dentfyDarkBlue,
          backgroundGradientFrom: colors.dentfyDarkBlue,
          backgroundGradientTo: colors.dentfyDarkBlue,
          color: (opacity = 1) => `${colors.dentfyAmberLighter}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          labelColor: (opacity = 1) => `${colors.dentfyAmberLighter}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="quantidade"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
} 