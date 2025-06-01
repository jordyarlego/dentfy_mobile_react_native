'use client';

import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Alert, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderPerito from '../../../components/header';
import DetalhesCaso from '../../../components/caso/DetalhesCaso';
import ListaVitimas from '../../../components/caso/ListaVitimas';
import ListaEvidencias from '../../../components/caso/ListaEvidencias';
import ListaPeritos from '../../../components/caso/ListaPeritos';
import ModalNovaVitima from '../../../components/caso/ModalNovaVitima';
import ModalNovaEvidencia from '../../../components/caso/ModalNovaEvidencia';
import ModalDetalhesEvidencia from '../../../components/caso/ModalDetalhesEvidencia';
import ModalEditarVitima from '../../../components/caso/ModalEditarVitima';
import ModalConfirmacao from '../../../components/caso/ModalConfirmacao';
import FeedbackToast from '../../../components/caso/FeedbackToast';
import { useToast } from '../../../contexts/ToastContext';
import type { Caso, Vitima, Evidencia, Perito } from '../../../types/caso';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
  VITIMAS: (casoId: string) => `@dentify_caso_${casoId}_vitimas`,
  EVIDENCIAS: (casoId: string) => `@dentify_caso_${casoId}_evidencias`,
};

export default function DetalhesCasoPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  
  // Estados
  const [caso, setCaso] = useState<Caso | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados dos modais
  const [modalNovaVitima, setModalNovaVitima] = useState(false);
  const [modalNovaEvidencia, setModalNovaEvidencia] = useState(false);
  const [modalDetalhesEvidencia, setModalDetalhesEvidencia] = useState(false);
  const [modalEditarVitima, setModalEditarVitima] = useState(false);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  
  // Estados de seleção
  const [vitimaSelecionada, setVitimaSelecionada] = useState<Vitima | null>(null);
  const [evidenciaSelecionada, setEvidenciaSelecionada] = useState<Evidencia | null>(null);
  
  // Feedback
  const [feedback, setFeedback] = useState<{
    tipo: 'sucesso' | 'erro' | 'info';
    mensagem: string;
    visible: boolean;
  }>({ tipo: 'sucesso', mensagem: '', visible: false });

  // Carregar dados
  useEffect(() => {
    carregarCaso();
  }, [id]);

  const carregarCaso = async () => {
    try {
      setLoading(true);
      
      // Carregar caso
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      const casos: Caso[] = casosStr ? JSON.parse(casosStr) : [];
      let casoEncontrado = casos.find(c => c._id === id);
      
      if (!casoEncontrado) {
        showToast('Caso não encontrado', 'error');
        router.back();
        return;
      }
      
      // Garantir que as listas sejam arrays mesmo que vazias na primeira carga
      casoEncontrado = {
        ...casoEncontrado,
        vitimas: casoEncontrado.vitimas || [],
        evidencias: casoEncontrado.evidencias || [],
        peritos: casoEncontrado.peritos || [],
      };

      setCaso(casoEncontrado);
      
      // Carregar vítimas (mantido separadamente por enquanto)
      const vitimasStr = await AsyncStorage.getItem(STORAGE_KEYS.VITIMAS(id as string));
      if (vitimasStr) {
        const vitimasCarregadas: Vitima[] = JSON.parse(vitimasStr);
        setCaso(currentCaso => currentCaso ? { ...currentCaso, vitimas: vitimasCarregadas } : null);
      }
      
      // Carregar evidências (mantido separadamente por enquanto)
      const evidenciasStr = await AsyncStorage.getItem(STORAGE_KEYS.EVIDENCIAS(id as string));
      if (evidenciasStr) {
        const evidenciasCarregadas: Evidencia[] = JSON.parse(evidenciasStr);
         setCaso(currentCaso => currentCaso ? { ...currentCaso, evidencias: evidenciasCarregadas } : null);
      }
      
    } catch (error) {
      showToast('Erro ao carregar dados do caso', 'error');
      console.error('Erro ao carregar caso:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarCaso = async (casoAtualizado: Caso) => {
    try {
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      if (casosStr) {
        const casos: Caso[] = JSON.parse(casosStr);
        const index = casos.findIndex((c) => c._id === casoAtualizado._id);
        if (index !== -1) {
          casos[index] = casoAtualizado;
          await AsyncStorage.setItem(STORAGE_KEYS.CASOS, JSON.stringify(casos));
          setCaso(casoAtualizado);
        }
      }
    } catch (error) {
      showToast('Erro ao salvar caso', 'error');
    }
  };

  // Handlers
  const handleNovaEvidencia = async (novaEvidencia: Omit<Evidencia, '_id'>) => {
    try {
      const evidenciaCompleta: Evidencia = {
        ...novaEvidencia,
        _id: Date.now().toString(),
      };
      
      const novasEvidencias = [evidenciaCompleta, ...caso!.evidencias];
      const casoAtualizadoEvidencias = {
        ...caso!,
        evidencias: novasEvidencias,
      };
      await salvarCaso(casoAtualizadoEvidencias);
      
      setCaso(casoAtualizadoEvidencias);
      setModalNovaEvidencia(false);
      setFeedback({
        tipo: 'sucesso',
        mensagem: 'Evidência adicionada com sucesso!',
        visible: true,
      });
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Erro ao adicionar evidência',
        visible: true,
      });
    }
  };

  const handleAddVitima = async (novaVitima: Omit<Vitima, '_id'>) => {
    try {
      if (!caso) return;

      const vitimaComId: Vitima = {
        ...novaVitima,
        _id: Date.now().toString(),
      };

      const casoAtualizado: Caso = {
        ...caso,
        vitimas: [...caso.vitimas, vitimaComId],
      };

      await AsyncStorage.setItem(`@dentify_casos_${id}`, JSON.stringify(casoAtualizado));
      setCaso(casoAtualizado);
      setModalNovaVitima(false);
      showToast('Vítima adicionada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar vítima:', error);
      showToast('Erro ao adicionar vítima', 'error');
    }
  };

  const handleEditVitima = async (vitimaEditada: Vitima) => {
    try {
      if (!caso) return;

      const casoAtualizado: Caso = {
        ...caso,
        vitimas: caso.vitimas.map((v) => (v._id === vitimaEditada._id ? vitimaEditada : v)),
      };

      await AsyncStorage.setItem(`@dentify_casos_${id}`, JSON.stringify(casoAtualizado));
      setCaso(casoAtualizado);
      setModalEditarVitima(false);
      setModalDetalhesEvidencia(false);
      setVitimaSelecionada(null);
      showToast('Vítima atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar vítima:', error);
      showToast('Erro ao atualizar vítima', 'error');
    }
  };

  const handleDeleteVitima = async (vitimaId: string) => {
    try {
      if (!caso) return;

      const casoAtualizado: Caso = {
        ...caso,
        vitimas: caso.vitimas.filter((v) => v._id !== vitimaId),
      };

      await AsyncStorage.setItem(`@dentify_casos_${id}`, JSON.stringify(casoAtualizado));
      setCaso(casoAtualizado);
      setModalEditarVitima(false);
      setModalDetalhesEvidencia(false);
      setVitimaSelecionada(null);
      showToast('Vítima excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir vítima:', error);
      showToast('Erro ao excluir vítima', 'error');
    }
  };

  const handleDeletarEvidencia = async () => {
    try {
      const novasEvidencias = caso!.evidencias.filter((e: Evidencia) => e._id !== evidenciaSelecionada!._id);
      const casoAtualizadoEvidencias = {
        ...caso!,
        evidencias: novasEvidencias,
      };
      await salvarCaso(casoAtualizadoEvidencias);
      
      setCaso(casoAtualizadoEvidencias);
      setModalConfirmacao(false);
      setModalDetalhesEvidencia(false);
      setEvidenciaSelecionada(null);
      setFeedback({
        tipo: 'sucesso',
        mensagem: 'Evidência excluída com sucesso!',
        visible: true,
      });
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Erro ao excluir evidência',
        visible: true,
      });
    }
  };

  const handleAddPerito = () => {
    router.push(`/caso/${id}/perito/novo`);
  };

  const handleEditPerito = (perito: any) => {
    router.push(`/caso/${id}/perito/${perito._id}`);
  };

  const handleDeletePerito = async (perito: any) => {
    if (!caso) return;

    Alert.alert(
      'Confirmar exclusão',
      `Deseja realmente excluir o perito ${perito.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            const casoAtualizado = {
              ...caso,
              peritos: caso.peritos.filter((p: Perito) => p._id !== perito._id),
            };
            await salvarCaso(casoAtualizado);
          },
        },
      ]
    );
  };

  if (loading || !caso) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text style={{ color: '#9CA3AF' }}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito showBackButton />
      
      <ScrollView className="flex-1">
        <DetalhesCaso caso={caso} />

        <View className="p-4 space-y-6">
          <ListaVitimas
            vitimas={caso.vitimas}
            onAdd={() => setModalNovaVitima(true)}
            onEdit={(vitima) => {
              setVitimaSelecionada(vitima);
              setModalEditarVitima(true);
            }}
            onDelete={(vitima) => {
              setVitimaSelecionada(vitima);
              setModalConfirmacao(true);
            }}
          />

          <ListaEvidencias
            evidencias={caso.evidencias}
            onAdd={() => setModalNovaEvidencia(true)}
            onView={(evidencia) => {
              setEvidenciaSelecionada(evidencia);
              setModalDetalhesEvidencia(true);
            }}
            onDelete={(evidencia) => {
              setEvidenciaSelecionada(evidencia);
              setModalConfirmacao(true);
            }}
          />

          {caso.peritos && Array.isArray(caso.peritos) && (
            <ListaPeritos
              peritos={caso.peritos}
              onAdd={handleAddPerito}
              onEdit={handleEditPerito}
              onDelete={handleDeletePerito}
            />
          )}
        </View>
      </ScrollView>

      <ModalNovaVitima
        visible={modalNovaVitima}
        onClose={() => setModalNovaVitima(false)}
        onSave={handleAddVitima}
      />

      <ModalEditarVitima
        visible={modalEditarVitima}
        onClose={() => {
          setModalEditarVitima(false);
          setVitimaSelecionada(null);
        }}
        vitima={vitimaSelecionada!}
        onSave={handleEditVitima}
      />

      <ModalNovaEvidencia
        visible={modalNovaEvidencia}
        onClose={() => setModalNovaEvidencia(false)}
        onSave={handleNovaEvidencia}
      />

      <ModalDetalhesEvidencia
        visible={modalDetalhesEvidencia}
        onClose={() => {
          setModalDetalhesEvidencia(false);
          setEvidenciaSelecionada(null);
        }}
        evidencia={evidenciaSelecionada!}
        onEdit={() => {/* lógica de edição */}}
        onDelete={() => {/* lógica de exclusão */}}
      />

      <ModalConfirmacao
        visible={modalConfirmacao}
        onClose={() => setModalConfirmacao(false)}
        onConfirm={() => {
          handleDeleteVitima(vitimaSelecionada!._id);
          handleDeletarEvidencia();
        }}
        titulo="Confirmar exclusão"
        mensagem={
          evidenciaSelecionada
            ? 'Tem certeza que deseja excluir esta evidência?'
            : 'Tem certeza que deseja excluir esta vítima?'
        }
        textoConfirmacao="Excluir"
      />

      <FeedbackToast
        visible={feedback.visible}
        tipo={feedback.tipo}
        mensagem={feedback.mensagem}
        onClose={() => setFeedback((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
} 