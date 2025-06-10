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
  const screenWidth = Dimensions.get('window').width - 64; // Ajustado para o novo padding

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
      <View className="h-[200px] items-center justify-center">
        <View className="w-16 h-16 bg-dentfyCyan/20 rounded-full items-center justify-center mb-3 animate-pulse">
          <Text className="text-dentfyCyan text-2xl">📈</Text>
        </View>
        <Text className="text-dentfyTextSecondary">Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <BarChart
        data={data}
        width={screenWidth}
        height={200}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: 'transparent',
          backgroundGradientTo: 'transparent',
          decimalPlaces: 0,
          color: (opacity = 1) => `${colors.dentfyCyan}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          labelColor: (opacity = 1) => `${colors.dentfyTextSecondary}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.6,
          propsForLabels: {
            fontSize: 10,
          },
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        showValuesOnTopOfBars
        fromZero
        withInnerLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        segments={5}
      />
    </View>
  );
} 