import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '@/components/header';
import { Body, Heading } from '@/components/Typography';
import { colors } from '@/theme/colors';
import type { Evidencia } from '@/types/evidencia';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { buscarCasoCompleto } from '@/services/caso';
import axios from '@/services/api';
import { Laudo } from '@/services/laudo'; // ajuste o caminho
import { criarLaudo, assinarLaudo, gerarPDFLaudo, buscarLaudosPorEvidencia } from '@/services/laudo';
import { CustomAlert } from '@/components/Feedback/CustomAlert';
import type { Caso } from '@/types/caso';

interface UserInfo {
  _id: string;
  nome: string;
  cargo: string;
}

export default function LaudoEvidenciaPage() {
  const { evidenciaId: evidenceId, casoId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signing, setSigning] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [laudoTitle, setLaudoTitle] = useState('');
  const [peritoId, setPeritoId] = useState<string | null>(null);
  const [savedLaudos, setSavedLaudos] = useState<Laudo[]>([]);
  const [caso, setCaso] = useState<Caso | null>(null);
  const [evidencia, setEvidencia] = useState<Evidencia | null>(null);
  const [ultimoLaudoCriado, setUltimoLaudoCriado] = useState<Laudo | null>(null);

  // Alerta
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  const showCustomAlert = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const hideCustomAlert = () => {
    setAlertVisible(false);
  };


  const loadSavedLaudos = async () => {
    try {
      if (evidenceId) {
        const laudos = await buscarLaudosPorEvidencia(evidenceId as string);
        setSavedLaudos(laudos);
      }
    } catch (error) {
      console.error('Erro ao buscar laudos:', error);
      showCustomAlert('Erro', 'Erro ao buscar laudos da evidência.', 'error');
    }
  };

  useEffect(() => {
    const carregarDadosIniciais = async () => {
      try {
        if (!evidenceId) return;

        const userData = await AsyncStorage.getItem('@dentfy:usuario');
        if (userData) {
          const user: UserInfo = JSON.parse(userData);
          setPeritoId(user._id);
        }

        setLoading(true);
        const laudos = await buscarLaudosPorEvidencia(evidenceId as string);
        setSavedLaudos(laudos);
      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        showCustomAlert('Erro', 'Erro ao carregar dados iniciais.', 'error');
      } finally {
        setLoading(false);
      }
    };

    carregarDadosIniciais();
  }, [evidenceId]);

  const handleSave = async () => {
    if (!laudoTitle.trim()) {
      showCustomAlert('Erro', 'O título do laudo não pode ser vazio.', 'error');
      return;
    }

    if (!evidenceId || !peritoId) {
      showCustomAlert('Erro', 'Informações de evidência ou perito faltando.', 'error');
      return;
    }

    setSaving(true);
    try {
      const novoLaudo = await criarLaudo({
        titulo: laudoTitle,
        texto: laudoTitle,
        evidence: evidenceId as string, // <- agora está certo
        peritoResponsavel: peritoId,
      });

      setUltimoLaudoCriado(novoLaudo);
      showCustomAlert('Sucesso', 'Laudo salvo com sucesso!', 'success');
      setLaudoTitle('');
      await loadSavedLaudos();
    } catch (error) {
      console.error('Erro ao salvar laudo:', error);
      showCustomAlert('Erro', 'Erro ao salvar laudo.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSign = async () => {
    const laudo = ultimoLaudoCriado ?? savedLaudos[0];

    if (!laudo) {
      showCustomAlert('Erro', 'Nenhum laudo disponível para assinar.', 'error');
      return;
    }

    if (laudo.isSigned) {
      showCustomAlert('Aviso', 'Este laudo já está assinado.', 'warning');
      return;
    }

    setSigning(true);
    try {
      await assinarLaudo(laudo._id);
      showCustomAlert('Sucesso', 'Laudo assinado com sucesso!', 'success');
      await loadSavedLaudos();
    } catch (error) {
      console.error('Erro ao assinar laudo:', error);
      showCustomAlert('Erro', 'Erro ao assinar laudo.', 'error');
    } finally {
      setSigning(false);
    }
  };

  const handleGeneratePdf = async () => {
    const laudo = ultimoLaudoCriado ?? savedLaudos[0];

    if (!laudo) {
      showCustomAlert('Erro', 'Nenhum laudo disponível para gerar PDF.', 'error');
      return;
    }

    setGeneratingPdf(true);
    try {
      await gerarPDFLaudo(laudo._id);
      showCustomAlert('Sucesso', 'PDF gerado com sucesso! Baixando...', 'success');
      await handleDownloadPdf(laudo._id);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      showCustomAlert('Erro', 'Erro ao gerar PDF.', 'error');
    } finally {
      setGeneratingPdf(false);
    }
  };


  const handleDownloadPdf = async (laudoId: string) => {
    try {
      const url = `/api/laudos/${laudoId}/pdf`;
      const fileUri = `${FileSystem.documentDirectory}laudo_${laudoId}.pdf`;

      const response = await axios.get(url, {
        responseType: 'blob',
      });

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(',')[1];

        if (base64Data) {
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
          } else {
            Alert.alert('PDF salvo', `Arquivo salvo em ${fileUri}, mas não é possível abrir automaticamente.`);
          }
        } else {
          Alert.alert('Erro', 'Não foi possível ler o PDF.');
        }
      };

      reader.readAsDataURL(response.data);
    } catch (error) {
      console.error('Erro ao baixar o PDF:', error);
      Alert.alert('Erro', 'Falha ao baixar o PDF.');
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Heading size="large" className="text-dentfyAmber mb-2">
            Laudo da Evidência
          </Heading>
          <Body className="text-base text-dentfyTextSecondary">
            Preencha os detalhes para gerar ou gerenciar laudos.
          </Body>
        </View>

        <View className="mb-6">
          <Body className="text-base text-dentfyTextSecondary mb-1">Título do Laudo *</Body>
          <TextInput
            value={laudoTitle}
            onChangeText={setLaudoTitle}
            className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
            placeholder="Digite o Título do Laudo..."
            placeholderTextColor="#6B7280"
          />
        </View>

        <View className="bg-dentfyGray800 p-4 rounded-lg mb-6 border border-dentfyGray700">
          <Body className="text-dentfyAmber font-bold mb-1">Caso:</Body>
          {loading ? (
            <ActivityIndicator size="small" color={colors.dentfyTextPrimary} />
          ) : (
            <>
              {caso && (
                <Body className="text-dentfyTextPrimary text-lg mb-2">
                  <Body className="text-dentfyAmber font-bold">Título: </Body>
                  {caso.titulo}
                </Body>
              )}
              <Body className="text-dentfyTextPrimary">
                <Body className="text-dentfyAmber font-bold">ID: </Body>
                {casoId}
              </Body>
            </>
          )}
        </View>

        {evidenceId && (
          <View className="bg-dentfyGray800 p-4 rounded-lg mb-6 border border-dentfyGray700">
            <Body className="text-dentfyAmber font-bold mb-1">Evidência:</Body>
            <Body className="text-dentfyTextPrimary">
              <Body className="text-dentfyAmber font-bold">ID da Evidência: </Body>
              {evidenceId}
            </Body>
            <Body className="text-dentfyTextSecondary text-sm mt-2">
              Laudo específico para esta evidência
            </Body>
          </View>
        )}

        <View className="items-center mb-8">
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving || signing || generatingPdf}
            className={saving || signing || generatingPdf ? "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyAmberDisabled mb-5" : "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyAmber mb-5"}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save" size={20} color="white" />
            )}
            <Body className="text-white font-medium ml-2">
              {saving ? 'Salvando...' : 'Salvar'}
            </Body>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSign}
            disabled={saving || signing || generatingPdf || !(ultimoLaudoCriado ?? savedLaudos[0])}
            className={saving || signing || generatingPdf || !laudoTitle.trim() ? "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyMediumBlueDisabled mb-5" : "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-[#9E27FE] mb-5"}
          >
            {signing ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="pencil" size={20} color="white" />
            )}
            <Body className="text-white font-medium ml-2">
              {signing ? 'Assinando...' : 'Assinar'}
            </Body>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGeneratePdf}
            disabled={saving || signing || generatingPdf || savedLaudos.length === 0}
            className={saving || signing || generatingPdf || !laudoTitle.trim() ? "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyGray700" : "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyGray800 border border-dentfyGray700"}
          >
            {generatingPdf ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="document-text" size={20} color={colors.dentfyTextPrimary} />
            )}
            <Body className="text-dentfyTextPrimary font-medium ml-2">
              {generatingPdf ? 'Gerando PDF...' : 'Gerar PDF'}
            </Body>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Heading size="medium" className="text-dentfyAmber mb-4">
            Laudos Salvos
          </Heading>

          {savedLaudos.length === 0 ? (
            <View className="bg-dentfyGray800/30 p-4 rounded-lg">
              <Body className="text-dentfyTextPrimary text-center">
                Nenhum laudo salvo.
              </Body>
            </View>
          ) : (
            <View className="space-y-4">
              {savedLaudos.map((laudo) => (
                <TouchableOpacity
                  key={laudo._id}
                  onPress={() => handleDownloadPdf(laudo._id)}
                  className="bg-dentfyGray800/30 p-4 rounded-lg border border-dentfyGray700/30 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <Ionicons name="document-attach" size={24} color={colors.dentfyCyan} />
                    <View className="ml-3">
                      <Body className="text-dentfyTextPrimary font-semibold">
                        {laudo.titulo}
                      </Body>
                      <Body className="text-dentfyTextSecondary text-sm mt-1">
                        {`Criado em: ${new Date(laudo.createdAt).toLocaleDateString('pt-BR')}`}
                      </Body>
                      {laudo.isSigned && (
                        <View className="mt-1 flex-row items-center">
                          <Ionicons name="checkmark-circle" size={16} color={colors.successGreen} />
                          <Body className="text-dentfyGreen text-sm ml-1">Assinado</Body>
                        </View>
                      )}
                    </View>
                  </View>
                  <Ionicons name="download" size={24} color={colors.dentfyTextPrimary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View className="items-center mt-8 mb-8">
          <TouchableOpacity
            onPress={handleCancel}
            className="flex-row items-center justify-center py-2 px-6 rounded-lg bg-red-600 w-48"
          >
            <Ionicons name="close-circle" size={18} color="white" />
            <Body className="text-white font-medium ml-2 text-sm">
              Cancelar
            </Body>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
        onConfirm={hideCustomAlert}
      />
    </View>
  );
}
