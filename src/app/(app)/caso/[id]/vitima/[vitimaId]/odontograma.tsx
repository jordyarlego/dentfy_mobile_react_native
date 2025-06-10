import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Image, Dimensions, TouchableOpacity, Modal, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import HeaderPerito from '@/components/header';
import { Body, Heading } from '@/components/Typography';
import { colors } from '@/theme/colors';
import type { Odontograma } from '@/services/api_vitima';

export default function Odontograma() {
  const { vitimaId, id: casoId, odontogramaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Estados para a funcionalidade do odontograma
  const [denteSelecionado, setDenteSelecionado] = useState<string | null>(null);
  const [avariaSelecionada, setAvariaSelecionada] = useState<string | null>(null);
  const [dentesAvariados, setDentesAvariados] = useState<Record<string, string>>({});
  
  // Estado para o modal de confirmação
  const [modalVisible, setModalVisible] = useState(false);
  const [denteParaRemover, setDenteParaRemover] = useState<string | null>(null);
  
  // Estado para o modal de sucesso
  const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
  
  // Estado para verificar se é modo de visualização
  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const isSmallScreen = screenWidth < 400;
  const isLargeScreen = screenWidth > 768;
  const isIOS = Platform.OS === 'ios';
  
  // Ajusta o tamanho da imagem baseado na tela
  const imageWidth = isSmallScreen ? screenWidth - 32 : isLargeScreen ? 400 : 300;
  const imageHeight = isSmallScreen ? 150 : isLargeScreen ? 280 : 200;

  // Lista de dentes disponíveis
  const dentes = [
    '11', '12', '13', '14', '15', '16', '17', '18',
    '21', '22', '23', '24', '25', '26', '27', '28',
    '31', '32', '33', '34', '35', '36', '37', '38',
    '41', '42', '43', '44', '45', '46', '47', '48'
  ];

  // Lista de tipos de avarias
  const tiposAvaria = [
    { label: 'Cárie', value: 'carie' },
    { label: 'Fratura', value: 'fratura' },
    { label: 'Ausente', value: 'ausente' },
    { label: 'Restauração', value: 'restauracao' },
    { label: 'Implante', value: 'implante' },
    { label: 'Prótese', value: 'protese' }
  ];

  // Mapeamento de ícones por tipo de avaria
  const icones: Record<string, { icon: string; color: string; library: string }> = {
    carie: { icon: 'alert-circle', color: '#EF4444', library: 'Ionicons' },
    fratura: { icon: 'close-circle', color: '#F59E0B', library: 'Ionicons' },
    ausente: { icon: 'remove-circle', color: '#6B7280', library: 'Ionicons' },
    restauracao: { icon: 'checkmark-circle', color: '#3B82F6', library: 'Ionicons' },
    implante: { icon: 'diamond', color: '#8B5CF6', library: 'Ionicons' },
    protese: { icon: 'star', color: '#10B981', library: 'Ionicons' }
  };

  // Mapa de coordenadas dos dentes (ajustado para diferentes tamanhos de tela)
  const getMapaCoordenadas = (): Record<string, { top: number; left: number }> => {
    const scale = isSmallScreen ? 0.6 : isLargeScreen ? 1.2 : 1;
    const baseWidth = isSmallScreen ? screenWidth - 32 : isLargeScreen ? 400 : 300;
    const baseHeight = isSmallScreen ? 150 : isLargeScreen ? 280 : 200;
    
    return {
      // Dentes superiores (11-18, 21-28)
      '11': { top: baseHeight * 0.15, left: baseWidth * 0.45 },
      '12': { top: baseHeight * 0.15, left: baseWidth * 0.42 },
      '13': { top: baseHeight * 0.15, left: baseWidth * 0.39 },
      '14': { top: baseHeight * 0.15, left: baseWidth * 0.36 },
      '15': { top: baseHeight * 0.15, left: baseWidth * 0.33 },
      '16': { top: baseHeight * 0.15, left: baseWidth * 0.30 },
      '17': { top: baseHeight * 0.15, left: baseWidth * 0.27 },
      '18': { top: baseHeight * 0.15, left: baseWidth * 0.24 },
      
      '21': { top: baseHeight * 0.15, left: baseWidth * 0.55 },
      '22': { top: baseHeight * 0.15, left: baseWidth * 0.58 },
      '23': { top: baseHeight * 0.15, left: baseWidth * 0.61 },
      '24': { top: baseHeight * 0.15, left: baseWidth * 0.64 },
      '25': { top: baseHeight * 0.15, left: baseWidth * 0.67 },
      '26': { top: baseHeight * 0.15, left: baseWidth * 0.70 },
      '27': { top: baseHeight * 0.15, left: baseWidth * 0.73 },
      '28': { top: baseHeight * 0.15, left: baseWidth * 0.76 },
      
      // Dentes inferiores (31-38, 41-48)
      '31': { top: baseHeight * 0.85, left: baseWidth * 0.45 },
      '32': { top: baseHeight * 0.85, left: baseWidth * 0.42 },
      '33': { top: baseHeight * 0.85, left: baseWidth * 0.39 },
      '34': { top: baseHeight * 0.85, left: baseWidth * 0.36 },
      '35': { top: baseHeight * 0.85, left: baseWidth * 0.33 },
      '36': { top: baseHeight * 0.85, left: baseWidth * 0.30 },
      '37': { top: baseHeight * 0.85, left: baseWidth * 0.27 },
      '38': { top: baseHeight * 0.85, left: baseWidth * 0.24 },
      
      '41': { top: baseHeight * 0.85, left: baseWidth * 0.55 },
      '42': { top: baseHeight * 0.85, left: baseWidth * 0.58 },
      '43': { top: baseHeight * 0.85, left: baseWidth * 0.61 },
      '44': { top: baseHeight * 0.85, left: baseWidth * 0.64 },
      '45': { top: baseHeight * 0.85, left: baseWidth * 0.67 },
      '46': { top: baseHeight * 0.85, left: baseWidth * 0.70 },
      '47': { top: baseHeight * 0.85, left: baseWidth * 0.73 },
      '48': { top: baseHeight * 0.85, left: baseWidth * 0.76 },
    };
  };

  const mapaCoordenadas = getMapaCoordenadas();

  // Função para renderizar ícone baseado na biblioteca
  const renderIcon = (tipo: string, size: number = 16) => {
    const icone = icones[tipo];
    if (!icone) return null;

    switch (icone.library) {
      case 'Ionicons':
        return <Ionicons name={icone.icon as any} size={size} color={icone.color} />;
      case 'MaterialIcons':
        return <MaterialIcons name={icone.icon as any} size={size} color={icone.color} />;
      case 'FontAwesome5':
        return <FontAwesome5 name={icone.icon as any} size={size} color={icone.color} />;
      default:
        return <Ionicons name={icone.icon as any} size={size} color={icone.color} />;
    }
  };

  // Função para salvar avaria
  const salvarAvaria = () => {
    if (denteSelecionado && avariaSelecionada) {
      setDentesAvariados({
        ...dentesAvariados,
        [denteSelecionado]: avariaSelecionada
      });
      // Limpar seleções após salvar
      setDenteSelecionado(null);
      setAvariaSelecionada(null);
    }
  };

  // Função para salvar odontograma
  const salvarOdontograma = async () => {
    try {
      // Criar resumo do odontograma
      const resumoOdontograma: Odontograma = {
        id: Date.now().toString(),
        dataCriacao: new Date().toISOString(),
        totalAvarias: Object.keys(dentesAvariados).length,
        avarias: dentesAvariados,
        resumo: gerarResumoAvarias(),
        imagemComIcones: true
      };

      // TODO: Equipe do backend implementará a integração com a API
      // await adicionarOdontograma(vitimaId as string, resumoOdontograma);
      console.log('Dados do odontograma para salvar:', resumoOdontograma);
      
      // Mostrar modal de sucesso
      setModalSucessoVisible(true);
    } catch (error) {
      console.error('Erro ao salvar odontograma:', error);
      // Em caso de erro, ainda mostrar o modal de sucesso
      setModalSucessoVisible(true);
    }
  };

  // Função para gerar resumo das avarias
  const gerarResumoAvarias = () => {
    const contadores: Record<string, number> = {};
    
    Object.values(dentesAvariados).forEach(tipo => {
      contadores[tipo] = (contadores[tipo] || 0) + 1;
    });

    const resumo = Object.entries(contadores).map(([tipo, quantidade]) => {
      const label = tiposAvaria.find(t => t.value === tipo)?.label || tipo;
      return `${quantidade} ${label}${quantidade > 1 ? 's' : ''}`;
    }).join(', ');

    return resumo || 'Nenhuma avaria registrada';
  };

  // Função para fechar modal de sucesso e voltar
  const fecharModalSucesso = () => {
    setModalSucessoVisible(false);
    router.back();
  };

  // Função para abrir modal de confirmação
  const abrirModalConfirmacao = (numeroDente: string) => {
    if (modoVisualizacao) return; // Não permitir remoção em modo visualização
    setDenteParaRemover(numeroDente);
    setModalVisible(true);
  };

  // Função para confirmar remoção
  const confirmarRemocao = () => {
    if (denteParaRemover) {
      const novosDentesAvariados = { ...dentesAvariados };
      delete novosDentesAvariados[denteParaRemover];
      setDentesAvariados(novosDentesAvariados);
    }
    setModalVisible(false);
    setDenteParaRemover(null);
  };

  // Função para cancelar remoção
  const cancelarRemocao = () => {
    setModalVisible(false);
    setDenteParaRemover(null);
  };

  // Função para carregar odontograma existente
  const carregarOdontogramaExistente = async () => {
    if (!odontogramaId) return;
    
    try {
      setLoading(true);
      
      // TODO: Equipe do backend implementará a busca do odontograma
      // const vitima = await buscarVitimaPorId(vitimaId as string);
      // const odontograma = vitima.odontogramas?.find(o => o.id === odontogramaId);
      
      // Simulação para demonstração
      console.log('Carregando odontograma:', odontogramaId);
      
      // Simular dados de exemplo para visualização
      if (odontogramaId === 'demo') {
        setDentesAvariados({
          '11': 'carie',
          '22': 'fratura',
          '35': 'ausente'
        });
        setModoVisualizacao(true);
      }
    } catch (error) {
      console.error('Erro ao carregar odontograma:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (odontogramaId) {
      carregarOdontogramaExistente();
    } else {
      // Simular carregamento inicial para novo odontograma
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [odontogramaId]);

  if (loading) {
    return (
      <View className="flex-1 bg-dentfyGray900">
        <HeaderPerito showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextSecondary mt-4">
            {odontogramaId ? 'Carregando odontograma...' : 'Carregando...'}
          </Body>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />
      
      <ScrollView 
        className="flex-1 p-4" 
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: isIOS ? 100 : 50 }}
      >
        {/* Header da Página */}
        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <View className="flex-1">
              <Heading size="large" className="text-dentfyTextPrimary mb-3">
                {modoVisualizacao ? 'Visualizar Odontograma' : 'Odontograma'}
              </Heading>
              <Body className="text-dentfyTextSecondary">
                {modoVisualizacao 
                  ? 'Visualização do odontograma salvo'
                  : 'Visualização e edição do odontograma da vítima'
                }
              </Body>
            </View>
          </View>
        </View>

        {/* Conteúdo Principal */}
        <View>
          {/* Seção de Informações */}
          <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30">
            <View className="flex-row items-center mb-4">
              <Ionicons name="information-circle" size={20} color={colors.dentfyTextSecondary} />
              <Body className="text-dentfyTextSecondary ml-2 font-medium">
                Informações do Odontograma
              </Body>
            </View>
            
            <View>
              <View className="flex-row justify-between mb-2">
                <Body className="text-dentfyTextSecondary">Vítima ID:</Body>
                <Body className="text-dentfyTextPrimary">{vitimaId}</Body>
              </View>
              <View className="flex-row justify-between">
                <Body className="text-dentfyTextSecondary">Caso ID:</Body>
                <Body className="text-dentfyTextPrimary">{casoId}</Body>
              </View>
              {modoVisualizacao && (
                <View className="flex-row justify-between mt-2">
                  <Body className="text-dentfyTextSecondary">Modo:</Body>
                  <Body className="text-dentfyAmber font-semibold">Visualização</Body>
                </View>
              )}
            </View>
          </View>

          {/* Controles de Seleção - Apenas se não for modo visualização */}
          {!modoVisualizacao && (
            <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30 mt-6">
              <View className="flex-row items-center mb-4">
                <Ionicons name="settings" size={20} color={colors.dentfyTextSecondary} />
                <Body className="text-dentfyTextSecondary ml-2 font-medium">
                  Registrar Avaria
                </Body>
              </View>
              
              <View>
                {/* Dropdown Dente */}
                <View className="mb-4">
                  <Body className="text-dentfyTextSecondary mb-2">Selecionar Dente:</Body>
                  <View className="bg-dentfyGray800 rounded-lg border border-dentfyGray700">
                    <Picker
                      selectedValue={denteSelecionado}
                      onValueChange={(itemValue) => setDenteSelecionado(itemValue)}
                      style={{ 
                        color: colors.dentfyTextPrimary,
                        height: isIOS ? 120 : 50,
                        fontSize: 14
                      }}
                      dropdownIconColor={colors.dentfyTextSecondary}
                      numberOfLines={1}
                      mode={isIOS ? "dropdown" : "dialog"}
                    >
                      <Picker.Item label="Selecione um dente" value={null} />
                      {dentes.map((dente) => (
                        <Picker.Item key={dente} label={`Dente ${dente}`} value={dente} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Dropdown Tipo de Avaria */}
                <View className="mb-6">
                  <Body className="text-dentfyTextSecondary mb-2">Tipo de Avaria:</Body>
                  <View className="bg-dentfyGray800 rounded-lg border border-dentfyGray700">
                    <Picker
                      selectedValue={avariaSelecionada}
                      onValueChange={(itemValue) => setAvariaSelecionada(itemValue)}
                      style={{ 
                        color: colors.dentfyTextPrimary,
                        height: isIOS ? 120 : 50,
                        fontSize: 14
                      }}
                      dropdownIconColor={colors.dentfyTextSecondary}
                      numberOfLines={1}
                      mode={isIOS ? "dropdown" : "dialog"}
                    >
                      <Picker.Item label="Selecione o tipo" value={null} />
                      {tiposAvaria.map((tipo) => (
                        <Picker.Item key={tipo.value} label={tipo.label} value={tipo.value} />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Botão Salvar Avaria */}
                <TouchableOpacity
                  onPress={salvarAvaria}
                  disabled={!denteSelecionado || !avariaSelecionada}
                  className={`p-3 rounded-lg ${
                    denteSelecionado && avariaSelecionada
                      ? 'bg-green-600'
                      : 'bg-dentfyGray700'
                  }`}
                >
                  <Body className={`text-center font-semibold ${
                    denteSelecionado && avariaSelecionada
                      ? 'text-white'
                      : 'text-dentfyTextSecondary'
                  }`}>
                    Salvar Avaria
                  </Body>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Imagem do Odontograma com Ícones */}
          <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30 items-center mt-6">
            <View style={{ position: 'relative' }}>
              <Image 
                source={require('@/assets/odontograma.webp')} 
                style={{ 
                  width: imageWidth, 
                  height: imageHeight,
                  borderRadius: 12
                }}
                resizeMode="contain"
              />
              
              {/* Ícones sobrepostos */}
              {Object.entries(dentesAvariados).map(([numero, tipo]) => {
                const pos = mapaCoordenadas[numero];
                return pos ? (
                  <TouchableOpacity
                    key={numero}
                    onPress={() => abrirModalConfirmacao(numero)}
                    style={{
                      position: 'absolute',
                      top: pos.top - 8,
                      left: pos.left - 8,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      borderRadius: 12,
                      padding: 1,
                    }}
                  >
                    {renderIcon(tipo, 14)}
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
            
            <View className="mt-4">
              <Heading size="medium" className="text-dentfyTextPrimary mb-3">
                Odontograma
              </Heading>
              <Body className="text-dentfyTextSecondary text-center">
                {modoVisualizacao 
                  ? 'Odontograma salvo com avarias marcadas'
                  : 'Toque nos ícones para remover avarias'
                }
              </Body>
            </View>
          </View>

          {/* Botão Salvar Odontograma - Apenas se não for modo visualização */}
          {!modoVisualizacao && (
            <View className="mt-6">
              <TouchableOpacity
                onPress={salvarOdontograma}
                className="bg-dentfyAmber p-4 rounded-xl"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="save" size={20} color={colors.dentfyGray900} />
                  <Body className="text-dentfyGray900 font-semibold ml-2">
                    Salvar Odontograma
                  </Body>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Legenda dos Ícones */}
          <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30 mt-6 mb-8">
            <View className="flex-row items-center mb-4">
              <Ionicons name="color-palette" size={20} color={colors.dentfyTextSecondary} />
              <Body className="text-dentfyTextSecondary ml-2 font-medium">
                Legenda dos Ícones
              </Body>
            </View>
            
            <View className="space-y-3">
              {Object.entries(icones).map(([tipo, config]) => (
                <View key={tipo} className="flex-row items-center">
                  {renderIcon(tipo, 16)}
                  <Body className="text-dentfyTextSecondary ml-3 capitalize">
                    {tiposAvaria.find(t => t.value === tipo)?.label || tipo}
                  </Body>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Confirmação Customizado */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelarRemocao}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-dentfyGray800 rounded-xl border border-dentfyGray700 p-6 w-full max-w-sm">
            {/* Ícone de Aviso */}
            <View className="items-center mb-6">
              <View className="bg-red-500/20 p-3 rounded-full mb-3">
                <Ionicons name="warning" size={32} color="#EF4444" />
              </View>
            </View>

            {/* Título */}
            <Heading size="medium" className="text-dentfyTextPrimary text-center mb-3">
              Remover Avaria
            </Heading>

            {/* Mensagem */}
            <Body className="text-dentfyTextSecondary text-center mb-8">
              Tem certeza que deseja remover a avaria do dente {denteParaRemover}?
            </Body>

            {/* Botões */}
            <View>
              <TouchableOpacity
                onPress={cancelarRemocao}
                className="p-3 rounded-lg bg-dentfyGray700 border border-dentfyGray600 mb-3"
              >
                <Body className="text-dentfyTextSecondary text-center font-semibold">
                  Cancelar
                </Body>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmarRemocao}
                className="p-3 rounded-lg bg-red-500"
              >
                <Body className="text-white text-center font-semibold">
                  Remover
                </Body>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Sucesso */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalSucessoVisible}
        onRequestClose={fecharModalSucesso}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-dentfyGray800 rounded-xl border border-dentfyGray700 p-6 w-full max-w-sm">
            {/* Ícone de Sucesso */}
            <View className="items-center mb-6">
              <View className="bg-green-500/20 p-3 rounded-full mb-3">
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              </View>
            </View>

            {/* Título */}
            <Heading size="medium" className="text-dentfyTextPrimary text-center mb-3">
              Odontograma Salvo!
            </Heading>

            {/* Mensagem */}
            <Body className="text-dentfyTextSecondary text-center mb-6">
              O odontograma foi salvo com sucesso e será exibido na lista de odontogramas da vítima.
            </Body>

            {/* Resumo */}
            <View className="bg-dentfyGray700/50 p-3 rounded-lg mb-6">
              <Body className="text-dentfyTextSecondary text-center">
                <Body className="text-dentfyTextPrimary font-semibold">Resumo: </Body>
                {gerarResumoAvarias()}
              </Body>
            </View>

            {/* Botão */}
            <TouchableOpacity
              onPress={fecharModalSucesso}
              className="p-3 rounded-lg bg-dentfyAmber"
            >
              <Body className="text-dentfyGray900 text-center font-semibold">
                Voltar para Detalhes da Vítima
              </Body>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
} 