import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';

interface CasoPorTipo {
  tipo: string;
  quantidade: number;
}

interface Props {
  casos: CasoPorTipo[];
  isLoading: boolean;
}

export default function DashboardPeritoCasosMensais({ casos, isLoading }: Props) {
  const screenWidth = Dimensions.get('window').width - 32; // 32 = padding do container

  const data = {
    labels: casos.map((caso) => caso.tipo),
    datasets: [
      {
        data: casos.map((caso) => caso.quantidade),
      },
    ],
  };

  if (isLoading) {
    return (
      <View className="bg-dentfyDarkBlue p-4 rounded-lg border border-dentfyCyan/30">
        <Text className="text-base font-semibold text-dentfyTextPrimary mb-3">
          Casos por Tipo
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
        Casos por Tipo
      </Text>
      <BarChart
        data={data}
        width={screenWidth}
        height={200}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: colors.dentfyDarkBlue,
          backgroundGradientFrom: colors.dentfyDarkBlue,
          backgroundGradientTo: colors.dentfyDarkBlue,
          decimalPlaces: 0,
          color: (opacity = 1) => `${colors.dentfyAmberLight}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          labelColor: (opacity = 1) => `${colors.dentfyAmberLighter}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.5,
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        showValuesOnTopOfBars
        fromZero
      />
    </View>
  );
} 