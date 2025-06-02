"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, RefreshControl } from 'react-native';
import { Heading, Body } from '../../components/Typography';
import { useToast } from '../../contexts/ToastContext';
import { colors } from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '../../components/header';
import { useRouter } from 'expo-router';
import { buscarCasos } from '../../services/caso';

export interface CasoData {
  _id: string;
  titulo: string;
  descricao: string;
  responsavel: string;
  status: "Em andamento" | "Finalizado" | "Arquivado";
  tipo: "Vitima" | "Desaparecido" | "Outro";
  dataAbertura: string;
  dataFechamento?: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  local: string;
}
export type CasoCreateData = Omit<CasoData, '_id' | 'dataFechamento'> & {
  dataFechamento?: string;
};

const FILTER_OPTIONS = [
  { id: 'todos', label: 'Todos' },
  { id: 'semana', label: 'Última Semana' },
  { id: 'mes', label: 'Este Mês' },
  { id: 'ano', label: 'Este Ano' },
];

const STATUS_OPTIONS = [
  { id: 'todos', label: 'Todos' },
  { id: 'Em andamento', label: 'Em andamento' },
  { id: 'Finalizado', label: 'Finalizado' },
  { id: 'Arquivado', label: 'Arquivado' },
];

const getStatusStyle = (status: CasoData['status']) => {
  switch (status) {
    case 'Finalizado':
      return 'bg-green-500/10 text-green-400 border-green-500/30';
    case 'Em andamento':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'Arquivado':
      return 'bg-red-500/10 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
  }
};

export default function Casos() {
  const router = useRouter();
  const { showToast } = useToast();
  const [casos, setCasos] = useState<CasoData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);

  const loadCasos = useCallback(async () => {
  try {
    const data = await buscarCasos();
    if (Array.isArray(data)) {
      setCasos(data);
    } else {
      setCasos([]);
      showToast('Dados de casos inválidos', 'error');
    }
  } catch (error) {
    setCasos([]);
    showToast('Erro ao carregar casos', 'error');
  }
}, [showToast]);

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
    const statusMatch = filtroStatus === 'todos' || caso.status === filtroStatus;
    const data = new Date(caso.dataAbertura);
    const hoje = new Date();

    if (filtro === 'semana') {
      const diff = Math.abs(hoje.getTime() - data.getTime());
      const dias = diff / (1000 * 3600 * 24);
      return nomeMatch && statusMatch && dias <= 7;
    }

    if (filtro === 'mes') {
      return (
        nomeMatch &&
        statusMatch &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      );
    }

    if (filtro === 'ano') {
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

          <View className="mt-4 relative">
            <TextInput
              placeholder="Pesquisar casos..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={colors.textSecondary}
              className="w-full px-4 py-2 bg-gray-800/80 text-gray-200 rounded-lg border border-gray-700 pr-10"
            />
            <View className="absolute right-3 top-3">
              <Ionicons
                name="search"
                size={20}
                color={colors.textSecondary}
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
              <Text className="text-gray-400 mt-4 text-center">
                Nenhum caso encontrado com os filtros selecionados.
              </Text>
            </View>
          ) : (
            casosFiltrados.map((caso) => (
              <TouchableOpacity
                key={caso._id}
                onPress={() => handleCasePress(caso._id)}
                className="m-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <View className="flex-row justify-between">
                  <Heading size="medium" className="text-gray-100 flex-1">{caso.titulo}</Heading>
                  <Text className={`text-sm px-2 py-1 rounded-full border ${getStatusStyle(caso.status)}`}>
                    {caso.status}
                  </Text>
                </View>
                <Body className="text-gray-400 mt-2">{caso.descricao}</Body>
                <Body className="text-gray-400 mt-2 text-xs">
                  Aberto em: {new Date(caso.dataAbertura).toLocaleDateString()}
                </Body>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Filter Modal */}
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
                      className={`mr-2 px-4 py-2 rounded-full border ${filtro === option.id
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
                      className={`mr-2 px-4 py-2 rounded-full border ${filtroStatus === option.id
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
      </View>
    </View>
  );
}
