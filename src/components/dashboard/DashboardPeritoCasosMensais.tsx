import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

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
      <View className="bg-[#0E1A26] p-4 rounded-lg border border-cyan-900/30">
        <Text className="text-base font-semibold text-amber-100 mb-3">
          Casos por Tipo
        </Text>
        <View className="h-[200px] items-center justify-center">
          <Text className="text-amber-100/70">Carregando...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-[#0E1A26] p-4 rounded-lg border border-cyan-900/30">
      <Text className="text-base font-semibold text-amber-100 mb-3">
        Casos por Tipo
      </Text>
      <BarChart
        data={data}
        width={screenWidth}
        height={200}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#0E1A26',
          backgroundGradientFrom: '#0E1A26',
          backgroundGradientTo: '#0E1A26',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(234, 179, 8, ${opacity})`, // yellow-500
          labelColor: (opacity = 1) => `rgba(254, 243, 199, ${opacity})`, // amber-100
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