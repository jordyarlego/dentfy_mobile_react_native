"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, ScrollView, TextInput, RefreshControl, Modal } from 'react-native';
import { Heading, Body } from '../../components/Typography';
import { useToast } from '../../contexts/ToastContext';
import { colors } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '../../components/header';
import { useRouter } from 'expo-router';
import { buscarCasos } from '../../services/caso';
import type { CasoData, CasoStatusAPI, CasoStatusFrontend } from '../../components/CaseCard';
import { CaseCard, convertStatusToFrontend } from '../../components/CaseCard';

// Tipos
export type CasoCreateData = Omit<CasoData, '_id' | 'dataFechamento'> & {
  dataFechamento?: string;
};

type FiltroPeriodo = 'todos' | 'semana' | 'mes' | 'ano';
type FiltroStatus = 'todos' | CasoStatusFrontend;

// Constantes
const FILTROS_PERIODO = [
  { id: 'todos' as const, label: 'Todos' },
  { id: 'semana' as const, label: 'Última-Semana' },
  { id: 'mes' as const, label: 'Este Mês' },
  { id: 'ano' as const, label: 'Este Ano' },
];

const FILTROS_STATUS = [
  { id: 'todos' as const, label: 'Todos' },
  { id: 'em_andamento' as const, label: 'Em andamento' },
  { id: 'concluido' as const, label: 'Concluído' },
  { id: 'arquivado' as const, label: 'Arquivado' },
];

// Componentes
const BarraPesquisa = ({ 
  search, 
  setSearch 
}: { 
  search: string; 
  setSearch: (text: string) => void 
}) => (
  <View className="mt-4 relative">
    <TextInput
      placeholder="Pesquisar casos..."
      value={search}
      onChangeText={setSearch}
      placeholderTextColor={colors.dentfyTextSecondary}
      className="w-full px-4 py-2 bg-dentfyGray800/80 text-dentfyTextPrimary rounded-lg border border-dentfyBorderGray pr-10"
    />
    <View className="absolute right-3 top-3">
      <Ionicons
        name="search"
        size={20}
        color={colors.dentfyTextSecondary}
      />
    </View>
  </View>
);

const BarraAcoes = ({ 
  onFilterPress, 
  onAddPress 
}: { 
  onFilterPress: () => void; 
  onAddPress: () => void 
}) => (
  <View className="flex-row gap-2">
    <TouchableOpacity
      onPress={onFilterPress}
      className="p-2 bg-dentfyGray800 rounded-lg border border-dentfyBorderGray"
    >
      <Ionicons name="filter" size={20} color={colors.dentfyTextSecondary} />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onAddPress}
      className="flex-row items-center gap-2 px-4 py-2 bg-dentfyAmber/10 rounded-lg border border-dentfyAmber/30"
    >
      <Ionicons name="add-circle-outline" size={20} color={colors.dentfyAmber} />
      <Body className="text-dentfyAmber">Novo Caso</Body>
    </TouchableOpacity>
  </View>
);

const ListaVazia = () => (
  <View className="flex-1 items-center justify-center p-8">
    <Ionicons 
      name="document-text-outline" 
      size={48} 
      color={colors.dentfyTextSecondary} 
    />
    <Body 
      size="small" 
      className="text-dentfyTextSecondary mt-4 text-center"
    >
      Nenhum caso encontrado com os filtros selecionados.
    </Body>
  </View>
);

const ModalFiltros = ({
  visible,
  onClose,
  filtroPeriodo,
  setFiltroPeriodo,
  filtroStatus,
  setFiltroStatus,
}: {
  visible: boolean;
  onClose: () => void;
  filtroPeriodo: FiltroPeriodo;
  setFiltroPeriodo: (filtro: FiltroPeriodo) => void;
  filtroStatus: FiltroStatus;
  setFiltroStatus: (filtro: FiltroStatus) => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View className="flex-1 bg-overlayBlack justify-end">
      <View className="bg-dentfyGray800 rounded-t-2xl p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Heading size="medium" className="text-dentfyTextPrimary">Filtros</Heading>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.dentfyTextSecondary} />
          </TouchableOpacity>
        </View>

        <View className="mb-4">
          <Body className="text-dentfyTextSecondary mb-2">Período</Body>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {FILTROS_PERIODO.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setFiltroPeriodo(option.id)}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  filtroPeriodo === option.id
                    ? 'bg-dentfyAmber/10 border-dentfyAmber/30'
                    : 'border-dentfyBorderGray'
                }`}
              >
                <Body className={filtroPeriodo === option.id ? 'text-dentfyAmber' : 'text-dentfyTextSecondary'}>
                  {option.label}
                </Body>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Body className="text-dentfyTextPrimary mb-2">Status</Body>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {FILTROS_STATUS.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => setFiltroStatus(option.id)}
                className={`mr-2 px-4 py-2 rounded-full border ${
                  filtroStatus === option.id
                    ? 'bg-dentfyAmber/10 border-dentfyAmber/30'
                    : 'border-dentfyBorderGray'
                }`}
              >
                <Body className={filtroStatus === option.id ? 'text-dentfyAmber' : 'text-dentfyTextSecondary'}>
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

// Componente Principal
export default function Casos() {
  const router = useRouter();
  const { showToast } = useToast();
  const [casos, setCasos] = useState<CasoData[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<FiltroPeriodo>('todos');
  const [filtroStatus, setFiltroStatus] = useState<FiltroStatus>('todos');
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

  const filtrarCasos = useCallback((caso: CasoData) => {
    if (!caso || !caso.titulo) return false;

    const nomeMatch = caso.titulo.toLowerCase().includes(search.toLowerCase());
    const statusFrontend = convertStatusToFrontend(caso.status);
    const statusMatch = filtroStatus === 'todos' || statusFrontend === filtroStatus;
    const data = new Date(caso.dataAbertura);
    const hoje = new Date();

    switch (filtroPeriodo) {
      case 'semana':
        const diff = Math.abs(hoje.getTime() - data.getTime());
        const dias = diff / (1000 * 3600 * 24);
        return nomeMatch && statusMatch && dias <= 7;
      
      case 'mes':
        return nomeMatch && 
               statusMatch && 
               data.getMonth() === hoje.getMonth() && 
               data.getFullYear() === hoje.getFullYear();
      
      case 'ano':
        return nomeMatch && 
               statusMatch && 
               data.getFullYear() === hoje.getFullYear();
      
      default:
        return nomeMatch && statusMatch;
    }
  }, [search, filtroStatus, filtroPeriodo]);

  const casosFiltrados = casos.filter(filtrarCasos);

  const handleCasePress = (caseId: string) => {
    router.push(`/caso/${caseId}`);
  };

  const handleAddCase = () => {
    router.push('/novo-caso');
  };

  return (
    <View className="flex-1 bg-dentfyDarkBlue">
      <HeaderPerito />

      <View className="flex-1">
        <View className="p-4 border-b border-dentfyBorderGray">
          <View className="flex-row justify-between items-center">
            <Heading size="large" className="text-dentfyTextPrimary">
              Casos
            </Heading>
            <BarraAcoes 
              onFilterPress={() => setShowFilters(true)} 
              onAddPress={handleAddCase} 
            />
          </View>

          <BarraPesquisa 
            search={search} 
            setSearch={setSearch} 
          />
        </View>

        <ScrollView
          className="flex-1"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.dentfyAmber]}
              tintColor={colors.dentfyAmber}
            />
          }
        >
          {casosFiltrados.length === 0 ? (
            <ListaVazia />
          ) : (
            casosFiltrados.map((caso) => (
              <CaseCard
                key={caso._id}
                caso={caso}
                onPress={() => handleCasePress(caso._id)}
              />
            ))
          )}
        </ScrollView>

        <ModalFiltros
          visible={showFilters}
          onClose={() => setShowFilters(false)}
          filtroPeriodo={filtroPeriodo}
          setFiltroPeriodo={setFiltroPeriodo}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
        />
      </View>
    </View>
  );
}
