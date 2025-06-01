import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderPerito from '../../components/header';
import { Picker } from '@react-native-picker/picker';
import { FolderIcon, CheckCircleIcon, ClockIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
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

          {/* Filtros */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            <View className="flex-1 min-w-[150px]">
              <View className="border border-cyan-900/30 rounded-lg bg-[#0E1A26]">
                <Picker
                  selectedValue={filtroPeriodo}
                  onValueChange={(value) => handleFiltroChange('periodo', value)}
                  enabled={!isLoading}
                  style={{ height: 50, color: '#fef3c7' }}
                  dropdownIconColor="#fef3c7"
                >
                  <Picker.Item label="Todos os Períodos" value="todos" color="#fef3c7" />
                  <Picker.Item label="Última Semana" value="semana" color="#fef3c7" />
                  <Picker.Item label="Último Mês" value="mes" color="#fef3c7" />
                  <Picker.Item label="Último Ano" value="ano" color="#fef3c7" />
                </Picker>
              </View>
            </View>

            <View className="flex-1 min-w-[150px]">
              <View className="border border-cyan-900/30 rounded-lg bg-[#0E1A26]">
                <Picker
                  selectedValue={filtroSexo}
                  onValueChange={(value) => handleFiltroChange('sexo', value)}
                  enabled={!isLoading}
                  style={{ height: 50, color: '#fef3c7' }}
                  dropdownIconColor="#fef3c7"
                >
                  <Picker.Item label="Todos os Sexos" value="todos" color="#fef3c7" />
                  <Picker.Item label="Masculino" value="masculino" color="#fef3c7" />
                  <Picker.Item label="Feminino" value="feminino" color="#fef3c7" />
                  <Picker.Item label="Outro" value="outro" color="#fef3c7" />
                </Picker>
              </View>
            </View>

            <View className="flex-1 min-w-[150px]">
              <View className="border border-cyan-900/30 rounded-lg bg-[#0E1A26]">
                <Picker
                  selectedValue={filtroEtnia}
                  onValueChange={(value) => handleFiltroChange('etnia', value)}
                  enabled={!isLoading}
                  style={{ height: 50, color: '#fef3c7' }}
                  dropdownIconColor="#fef3c7"
                >
                  <Picker.Item label="Todas as Etnias" value="todos" color="#fef3c7" />
                  <Picker.Item label="Branca" value="branco" color="#fef3c7" />
                  <Picker.Item label="Parda" value="pardo" color="#fef3c7" />
                  <Picker.Item label="Preta" value="preto" color="#fef3c7" />
                  <Picker.Item label="Amarela" value="amarelo" color="#fef3c7" />
                  <Picker.Item label="Indígena" value="indigena" color="#fef3c7" />
                  <Picker.Item label="Outra" value="outro" color="#fef3c7" />
                </Picker>
              </View>
            </View>
          </View>

          {/* Cards de Estatísticas */}
          <View className="mb-4">
            <Text className="text-base font-semibold text-amber-100 mb-3">Status dos Casos</Text>
            <View className="flex-row flex-wrap gap-2">
              <View className="flex-1 min-w-[150px] bg-[#0E1A26] p-3 rounded-lg border border-cyan-900/30">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-amber-100/70 text-xs">Total de Casos</Text>
                    <Text className="text-xl font-bold text-amber-100">
                      {isLoading ? '...' : totalCasos}
                    </Text>
                  </View>
                  <FolderIcon className="h-6 w-6 text-amber-500" />
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
                  <ClockIcon className="h-6 w-6 text-yellow-500" />
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
                  <CheckCircleIcon className="h-6 w-6 text-green-500" />
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
                  <ArchiveBoxIcon className="h-6 w-6 text-purple-500" />
                </View>
              </View>
            </View>
          </View>

          {/* Gráficos */}
          <View className="space-y-4">
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
