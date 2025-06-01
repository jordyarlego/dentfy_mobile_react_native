import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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
      color: '#eab308', // yellow-500
      legendFontColor: '#fef3c7', // amber-100
      legendFontSize: 12,
    },
    {
      name: 'Finalizados',
      quantidade: casosFinalizados,
      color: '#22c55e', // green-500
      legendFontColor: '#fef3c7',
      legendFontSize: 12,
    },
    {
      name: 'Arquivados',
      quantidade: casosArquivados,
      color: '#a855f7', // purple-500
      legendFontColor: '#fef3c7',
      legendFontSize: 12,
    },
  ];

  if (isLoading) {
    return (
      <View className="bg-[#0E1A26] p-4 rounded-lg border border-cyan-900/30">
        <Text className="text-base font-semibold text-amber-100 mb-3">
          Distribuição dos Casos
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
        Distribuição dos Casos
      </Text>
      <PieChart
        data={data}
        width={screenWidth}
        height={200}
        chartConfig={{
          backgroundColor: '#0E1A26',
          backgroundGradientFrom: '#0E1A26',
          backgroundGradientTo: '#0E1A26',
          color: (opacity = 1) => `rgba(254, 243, 199, ${opacity})`, // amber-100
          labelColor: (opacity = 1) => `rgba(254, 243, 199, ${opacity})`,
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