import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '@/components/header';
import { Body, Heading } from '@/components/Typography';
import { colors } from '@/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarCasoCompleto } from '@/services/caso';
import type { Caso } from '@/types/caso';
import { CustomAlert } from '@/components/Feedback/CustomAlert';

// Definindo uma interface para o relatório (compatível com o schema do backend)
interface Relatorio {
  _id: string;
  titulo: string;
  conteudo: string; // Conteúdo do relatório, por simplicidade, pode ser o mesmo do título ou outro campo de texto
  caso: string;
  peritoResponsavel: string;
  isSigned: boolean;
  dataCriacao: string;
}

interface UserInfo {
  _id: string;
  nome: string;
  cargo: string;
}

export default function RelatorioCasoPage() {
  const { id: casoId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [signing, setSigning] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [peritoId, setPeritoId] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<Relatorio[]>([]);
  const [caso, setCaso] = useState<Caso | null>(null);
  
  // Estados para o alerta customizado
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

  useEffect(() => {
    const loadPeritoInfo = async () => {
      try {
        const userData = await AsyncStorage.getItem('@dentfy:usuario');
        if (userData) {
          const user: UserInfo = JSON.parse(userData);
          setPeritoId(user._id);
        }
      } catch (error) {
        console.error('Erro ao carregar informações do perito:', error);
        showCustomAlert('Erro', 'Erro ao carregar informações do perito.', 'error');
      }
    };
    loadPeritoInfo();

    const loadCasoInfo = async () => {
      setLoading(true);
      try {
        if (casoId) {
          const data = await buscarCasoCompleto(casoId as string);
          setCaso(data.caso);
        }
      } catch (error) {
        console.error('Erro ao carregar caso:', error);
        showCustomAlert('Erro', 'Erro ao carregar informações do caso.', 'error');
      } finally {
        setLoading(false);
      }
    };
    loadCasoInfo();

    // Em uma implementação real, você carregaria os relatórios existentes do backend aqui
    // Para fins de demonstração, vamos simular alguns relatórios salvos.
    setSavedReports([
      {
        _id: 'report1',
        titulo: 'Relatório Inicial do Caso',
        conteudo: 'Este é o conteúdo do relatório inicial.',
        caso: casoId as string,
        peritoResponsavel: 'mock_perito_id_1',
        isSigned: true,
        dataCriacao: new Date().toISOString(),
      },
      {
        _id: 'report2',
        titulo: 'Relatório de Acompanhamento',
        conteudo: 'Detalhes do acompanhamento do caso.',
        caso: casoId as string,
        peritoResponsavel: 'mock_perito_id_1',
        isSigned: false,
        dataCriacao: new Date(Date.now() - 86400000).toISOString(), // Ontem
      },
    ]);
  }, [casoId]);

  const handleSave = async () => {
    if (!reportTitle.trim()) {
      showCustomAlert('Erro', 'O título do relatório não pode ser vazio.', 'error');
      return;
    }
    if (!casoId || !peritoId) {
      showCustomAlert('Erro', 'Informações de caso ou perito faltando.', 'error');
      return;
    }

    setSaving(true);
    console.log('Salvando relatório:', { titulo: reportTitle, casoId, peritoId });
    // TODO: Conectar com a API de salvar relatório
    await new Promise(resolve => setTimeout(resolve, 1500));
    showCustomAlert('Sucesso', 'Relatório salvo com sucesso!', 'success');
    setSaving(false);
    setReportTitle('');
    // Em uma implementação real, você recarregaria savedReports aqui
  };

  const handleSign = async () => {
    if (!reportTitle.trim()) {
      showCustomAlert('Erro', 'O título do relatório não pode ser vazio para assinar.', 'error');
      return;
    }
    setSigning(true);
    console.log('Assinando relatório:', { titulo: reportTitle, casoId, peritoId });
    // TODO: Conectar com a API de assinar relatório
    await new Promise(resolve => setTimeout(resolve, 1500));
    showCustomAlert('Sucesso', 'Relatório assinado com sucesso!', 'success');
    setSigning(false);
  };

  const handleGeneratePdf = async () => {
    if (!reportTitle.trim()) {
      showCustomAlert('Erro', 'Adicione um título para gerar o PDF.', 'error');
      return;
    }
    setGeneratingPdf(true);
    console.log('Gerando PDF para relatório:', { titulo: reportTitle, casoId, peritoId });
    // TODO: Conectar com a API de gerar PDF
    await new Promise(resolve => setTimeout(resolve, 2000));
    showCustomAlert('Sucesso', 'PDF gerado com sucesso!', 'success');
    setGeneratingPdf(false);
    // Em uma implementação real, você recarregaria savedReports aqui ou adicionaria o novo PDF
  };

  const handleDownloadPdf = (reportId: string, reportTitle: string) => {
    console.log(`Baixando PDF do relatório: ${reportTitle} (ID: ${reportId})`);
    // TODO: Conectar com a API de download de PDF
    showCustomAlert('Download', `Download do "${reportTitle}" iniciado!`, 'info');
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
            Relatório do Caso
          </Heading>
          <Body className="text-base text-dentfyTextSecondary">
            Preencha os detalhes para gerar ou gerenciar relatórios.
          </Body>
        </View>

        {/* Título do Relatório */}
        <View className="mb-6">
          <Body className="text-base text-dentfyTextSecondary mb-1">Título do Relatório *</Body>
          <TextInput
            value={reportTitle}
            onChangeText={setReportTitle}
            className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
            placeholder="Digite o Título..."
            placeholderTextColor="#6B7280"
          />
        </View>

        {/* Informações do Caso */}
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

        {/* Botões de Ação */}
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
            disabled={saving || signing || generatingPdf || !reportTitle.trim()}
            className={saving || signing || generatingPdf || !reportTitle.trim() ? "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyMediumBlueDisabled mb-5" : "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-[#9E27FE] mb-5"}
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
            disabled={saving || signing || generatingPdf || !reportTitle.trim()}
            className={saving || signing || generatingPdf || !reportTitle.trim() ? "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyGray700" : "flex-row items-center justify-center w-4/5 h-12 rounded-lg bg-dentfyGray800 border border-dentfyGray700"}
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

        {/* Relatórios Salvos */}
        <View className="mb-6">
          <Heading size="medium" className="text-dentfyAmber mb-4">
            Relatórios Salvos
          </Heading>

          {savedReports.length === 0 ? (
            <View className="bg-dentfyGray800/30 p-4 rounded-lg">
              <Body className="text-dentfyTextPrimary text-center">
                Nenhum relatório salvo.
              </Body>
            </View>
          ) : (
            <View className="space-y-4">
              {savedReports.map((report, index) => (
                <View key={report._id}>
                  <TouchableOpacity
                    onPress={() => handleDownloadPdf(report._id, report.titulo)}
                    className="bg-dentfyGray800/30 p-4 rounded-lg border border-dentfyGray700/30 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center">
                      <Ionicons name="document-attach" size={24} color={colors.dentfyCyan} />
                      <View className="ml-3">
                        <Body className="text-dentfyTextPrimary font-semibold">
                          {report.titulo}
                        </Body>
                        <Body className="text-dentfyTextSecondary text-sm mt-1">
                          {`Criado em: ${new Date(report.dataCriacao).toLocaleDateString('pt-BR')}`}
                        </Body>
                        {report.isSigned && (
                          <View className="mt-1 flex-row items-center">
                            <Ionicons name="checkmark-circle" size={16} color={colors.dentfyGreen} />
                            <Body className="text-dentfyGreen text-sm ml-1">Assinado</Body>
                          </View>
                        )}
                      </View>
                    </View>
                    <Ionicons name="download" size={24} color={colors.dentfyTextPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Botão Cancelar - No final */}
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

      {/* Alerta Customizado */}
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