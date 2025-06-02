import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderPerito from '../../components/header';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardPeritoDistribuicao from '../../components/dashboard/DashboardPeritoDistribuicao';
import DashboardPeritoCasosMensais from '../../components/dashboard/DashboardPeritoCasosMensais';

// Mock data - substituir por chamadas reais à API
const mockData = {
  casosEmAndamento: 15,
  casosFinalizados: 25,
  casosArquivados: 10,
  casosPorTipo: [
    { tipo: 'Homicídio', quantidade: 20 },
    { tipo: 'Latrocínio', quantidade: 15 },
    { tipo: 'Outros', quantidade: 15 },
  ],
};

export default function Dashboard() {
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroEtnia, setFiltroEtnia] = useState('todos');
  const [isLoading, setIsLoading] = useState(false);

  const handleFiltroChange = (tipo: 'periodo' | 'sexo' | 'etnia', valor: string) => {
    setIsLoading(true);
    switch (tipo) {
      case 'periodo':
        setFiltroPeriodo(valor);
        break;
      case 'sexo':
        setFiltroSexo(valor);
        break;
      case 'etnia':
        setFiltroEtnia(valor);
        break;
    }
    // Simular carregamento
    setTimeout(() => setIsLoading(false), 500);
  };

  const totalCasos = mockData.casosEmAndamento + mockData.casosFinalizados + mockData.casosArquivados;

  return (
    <SafeAreaView className="flex-1 bg-[#0E1A26]">
      <HeaderPerito />

      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          <Text className="text-2xl font-bold text-amber-100 mb-4">
            Dashboard do Perito
          </Text>

          {/* Filtros e Cards de Status */}
          <View className="flex-row flex-wrap gap-2">
            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-amber-100/70 text-xs">Total de Casos</Text>
                  <Text className="text-xl font-bold text-amber-100">
                    {isLoading ? '...' : totalCasos}
                  </Text>
                </View>
                <FontAwesome5 name="folder" size={24} color="#f59e0b" />
              </View>
            </View>

            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-amber-100/70 text-xs">Em Andamento</Text>
                  <Text className="text-xl font-bold text-amber-100">
                    {isLoading ? '...' : mockData.casosEmAndamento}
                  </Text>
                </View>
                <MaterialIcons name="access-time" size={24} color="#facc15" />
              </View>
            </View>

            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-amber-100/70 text-xs">Finalizados</Text>
                  <Text className="text-xl font-bold text-amber-100">
                    {isLoading ? '...' : mockData.casosFinalizados}
                  </Text>
                </View>
                <MaterialIcons name="check-circle" size={24} color="#22c55e" />
              </View>
            </View>

            <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-amber-100/70 text-xs">Arquivados</Text>
                  <Text className="text-xl font-bold text-amber-100">
                    {isLoading ? '...' : mockData.casosArquivados}
                  </Text>
                </View>
                <MaterialCommunityIcons name="archive" size={24} color="#a78bfa" />
              </View>
            </View>
          </View>

          {/* Gráficos */}
          <View className="space-y-4">
            <Text className="text-base font-semibold text-amber-100">
              Distribuição dos Casos
            </Text>
            <DashboardPeritoDistribuicao
              casosEmAndamento={mockData.casosEmAndamento}
              casosFinalizados={mockData.casosFinalizados}
              casosArquivados={mockData.casosArquivados}
              isLoading={isLoading}
            />
            <DashboardPeritoCasosMensais
              casos={mockData.casosPorTipo}
              isLoading={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
