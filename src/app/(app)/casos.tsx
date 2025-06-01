"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, RefreshControl } from 'react-native';
import { Heading, Body } from '../../components/Typography';
import { useToast } from '../../contexts/ToastContext';
import { colors } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '../../components/header';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Caso {
  _id: string;
  titulo: string;
  responsavel: string;
  dataAbertura: string;
  status: 'pending' | 'in_progress' | 'completed';
  descricao?: string;
  tipo?: string;
  sexo?: string;
  local?: string;
}

// Dados mockados para teste
const MOCK_CASES: Caso[] = [
  {
    _id: '1',
    titulo: 'Análise de Mordida em Caso de Agressão',
    responsavel: 'Dr. João Silva',
    dataAbertura: '2024-03-15',
    status: 'in_progress',
    descricao: 'Análise de padrão de mordida em caso de agressão física. Vítima apresenta marcas de mordida no braço.',
    tipo: 'Análise de Mordida',
    sexo: 'Masculino',
    local: 'IML São Paulo'
  },
  {
    _id: '2',
    titulo: 'Identificação por Registros Dentários',
    responsavel: 'Dra. Maria Santos',
    dataAbertura: '2024-03-14',
    status: 'completed',
    descricao: 'Identificação de vítima através de registros dentários. Corpo encontrado em estado avançado de decomposição.',
    tipo: 'Identificação',
    sexo: 'Feminino',
    local: 'IML Rio de Janeiro'
  },
  {
    _id: '3',
    titulo: 'Análise de Trauma Dental',
    responsavel: 'Dr. Pedro Oliveira',
    dataAbertura: '2024-03-13',
    status: 'pending',
    descricao: 'Avaliação de trauma dental em caso de violência doméstica. Vítima apresenta fratura em incisivo central superior.',
    tipo: 'Trauma Dental',
    sexo: 'Feminino',
    local: 'IML Belo Horizonte'
  },
  {
    _id: '4',
    titulo: 'Reconstrução de Arco Dental',
    responsavel: 'Dra. Ana Costa',
    dataAbertura: '2024-03-12',
    status: 'in_progress',
    descricao: 'Reconstrução de arco dental para identificação de suspeito em caso de homicídio.',
    tipo: 'Reconstrução',
    sexo: 'Masculino',
    local: 'IML Curitiba'
  },
  {
    _id: '5',
    titulo: 'Análise de Idade por Desenvolvimento Dental',
    responsavel: 'Dr. Carlos Mendes',
    dataAbertura: '2024-03-11',
    status: 'completed',
    descricao: 'Determinação de idade aproximada através do desenvolvimento dental em caso de ossada encontrada.',
    tipo: 'Determinação de Idade',
    sexo: 'Indeterminado',
    local: 'IML Salvador'
  }
];

const FILTER_OPTIONS = [
  { id: 'todos', label: 'Todos' },
  { id: 'semana', label: 'Última Semana' },
  { id: 'mes', label: 'Este Mês' },
  { id: 'ano', label: 'Este Ano' },
];

const STATUS_OPTIONS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pending', label: 'Pendentes' },
  { id: 'in_progress', label: 'Em Andamento' },
  { id: 'completed', label: 'Concluídos' },
];

const getStatusStyle = (status: Caso['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'in_progress':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'pending':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

const getStatusText = (status: Caso['status']) => {
  switch (status) {
    case 'completed':
      return 'Concluído';
    case 'in_progress':
      return 'Em Andamento';
    case 'pending':
      return 'Pendente';
    default:
      return status;
  }
};

const STORAGE_KEY = '@dentify_casos';

export default function Casos() {
  const router = useRouter();
  const { showToast } = useToast();
  const [casos, setCasos] = useState<Caso[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);

  const loadCasos = useCallback(async () => {
    try {
      const storedCasos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCasos) {
        setCasos(JSON.parse(storedCasos));
    } else {
        // Se não houver casos salvos, usa os mock cases
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CASES));
        setCasos(MOCK_CASES);
      }
    } catch (error) {
      showToast('Erro ao carregar casos', 'error');
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCasos();
    setRefreshing(false);
  }, [loadCasos]);

  useEffect(() => {
    loadCasos();
  }, [loadCasos]);

  const casosFiltrados = casos.filter((caso) => {
    if (!caso || !caso.titulo) return false;

    const nomeMatch = caso.titulo.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filtroStatus === "todos" || caso.status === filtroStatus;
    const data = new Date(caso.dataAbertura);
    const hoje = new Date();

    if (filtro === "semana") {
      const diff = Math.abs(hoje.getTime() - data.getTime());
      const dias = diff / (1000 * 3600 * 24);
      return nomeMatch && statusMatch && dias <= 7;
    }

    if (filtro === "mes") {
      return (
        nomeMatch &&
        statusMatch &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      );
    }

    if (filtro === "ano") {
      return nomeMatch && statusMatch && data.getFullYear() === hoje.getFullYear();
    }

    return nomeMatch && statusMatch;
  });

  const handleCasePress = (caseId: string) => {
    router.push(`/caso/${caseId}`);
  };

  const handleAddCase = () => {
    router.push('/novo-caso');
  };

  const FilterModal = () => (
    <Modal
      visible={showFilters}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilters(false)}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-gray-800 rounded-t-2xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Heading size="medium" className="text-gray-100">Filtros</Heading>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Body className="text-gray-300 mb-2">Período</Body>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {FILTER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setFiltro(option.id)}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    filtro === option.id
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'border-gray-700'
                  }`}
                >
                  <Body className={filtro === option.id ? 'text-amber-500' : 'text-gray-400'}>
                    {option.label}
                  </Body>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <Body className="text-gray-300 mb-2">Status</Body>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {STATUS_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setFiltroStatus(option.id)}
                  className={`mr-2 px-4 py-2 rounded-full border ${
                    filtroStatus === option.id
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'border-gray-700'
                  }`}
                >
                  <Body className={filtroStatus === option.id ? 'text-amber-500' : 'text-gray-400'}>
                    {option.label}
                  </Body>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito />
      
      <View className="flex-1">
        <View className="p-4 border-b border-gray-800">
          <View className="flex-row justify-between items-center">
            <Heading size="large" className="text-gray-100">Casos</Heading>
            <View className="flex-row gap-2">
              <TouchableOpacity 
                onPress={() => setShowFilters(true)}
                className="p-2 bg-gray-800 rounded-lg border border-gray-700"
              >
                <Ionicons name="filter" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleAddCase}
                className="flex-row items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/30"
              >
                <Ionicons name="add-circle-outline" size={20} color={colors.warning} />
                <Body className="text-amber-500">Novo Caso</Body>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-4">
            <View className="relative">
              <TextInput
                placeholder="Pesquisar casos..."
                value={search}
                onChangeText={setSearch}
                className="w-full px-4 py-2 bg-gray-800/80 text-gray-200 rounded-lg border border-gray-700"
                placeholderTextColor={colors.textSecondary}
              />
              <Ionicons 
                name="search" 
                size={20} 
                color={colors.textSecondary}
                className="absolute right-3 top-2.5"
              />
            </View>
          </View>
        </View>

        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.warning]}
              tintColor={colors.warning}
            />
          }
        >
          {casosFiltrados.length === 0 ? (
            <View className="flex-1 items-center justify-center p-8">
              <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
              <Body className="text-gray-500 mt-4">Nenhum caso encontrado</Body>
            </View>
          ) : (
            casosFiltrados.map((caso) => (
              <TouchableOpacity
                key={caso._id}
                onPress={() => handleCasePress(caso._id)}
                className="m-4 p-4 bg-gray-800/80 rounded-lg border border-gray-700"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <Heading size="small" className="text-gray-100 flex-1 mr-2">
                    {caso.titulo}
                  </Heading>
                  <View className={`px-3 py-1 rounded-full border ${getStatusStyle(caso.status)}`}>
                    <Body className="text-xs">
                      {getStatusText(caso.status)}
                    </Body>
                  </View>
                </View>
                
                <Body className="text-gray-300 mb-1">
                  Paciente: {caso.responsavel}
                </Body>
                
                <Body className="text-gray-400">
                  Data: {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
                </Body>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>

      <FilterModal />
    </View>
  );
}