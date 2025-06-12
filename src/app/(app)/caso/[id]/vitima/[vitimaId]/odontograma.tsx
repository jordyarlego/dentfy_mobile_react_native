import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Image, Dimensions, TouchableOpacity, Modal, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import HeaderPerito from '@/components/header';
import { Body, Heading } from '@/components/Typography';
import { colors } from '@/theme/colors';
import { buscarOdontogramaVitima } from '@/services/api_vitima';
import { atualizarOdontogramaVitima } from '@/services/api_vitima';


export default function Odontograma() {
  const { vitimaId, id: casoId } = useLocalSearchParams();
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
      // Dentes superiores (11-18, 21-28) - Ajustados para melhor posicionamento
      '11': { top: baseHeight * 0.12, left: baseWidth * 0.48 },
      '12': { top: baseHeight * 0.12, left: baseWidth * 0.44 },
      '13': { top: baseHeight * 0.12, left: baseWidth * 0.40 },
      '14': { top: baseHeight * 0.12, left: baseWidth * 0.36 },
      '15': { top: baseHeight * 0.12, left: baseWidth * 0.32 },
      '16': { top: baseHeight * 0.12, left: baseWidth * 0.28 },
      '17': { top: baseHeight * 0.12, left: baseWidth * 0.24 },
      '18': { top: baseHeight * 0.12, left: baseWidth * 0.20 },

      '21': { top: baseHeight * 0.12, left: baseWidth * 0.52 },
      '22': { top: baseHeight * 0.12, left: baseWidth * 0.56 },
      '23': { top: baseHeight * 0.12, left: baseWidth * 0.60 },
      '24': { top: baseHeight * 0.12, left: baseWidth * 0.64 },
      '25': { top: baseHeight * 0.12, left: baseWidth * 0.68 },
      '26': { top: baseHeight * 0.12, left: baseWidth * 0.72 },
      '27': { top: baseHeight * 0.12, left: baseWidth * 0.76 },
      '28': { top: baseHeight * 0.12, left: baseWidth * 0.80 },

      // Dentes inferiores (31-38, 41-48) - Ajustados para melhor posicionamento
      '31': { top: baseHeight * 0.88, left: baseWidth * 0.48 },
      '32': { top: baseHeight * 0.88, left: baseWidth * 0.44 },
      '33': { top: baseHeight * 0.88, left: baseWidth * 0.40 },
      '34': { top: baseHeight * 0.88, left: baseWidth * 0.36 },
      '35': { top: baseHeight * 0.88, left: baseWidth * 0.32 },
      '36': { top: baseHeight * 0.88, left: baseWidth * 0.28 },
      '37': { top: baseHeight * 0.88, left: baseWidth * 0.24 },
      '38': { top: baseHeight * 0.88, left: baseWidth * 0.20 },

      '41': { top: baseHeight * 0.88, left: baseWidth * 0.52 },
      '42': { top: baseHeight * 0.88, left: baseWidth * 0.56 },
      '43': { top: baseHeight * 0.88, left: baseWidth * 0.60 },
      '44': { top: baseHeight * 0.88, left: baseWidth * 0.64 },
      '45': { top: baseHeight * 0.88, left: baseWidth * 0.68 },
      '46': { top: baseHeight * 0.88, left: baseWidth * 0.72 },
      '47': { top: baseHeight * 0.88, left: baseWidth * 0.76 },
      '48': { top: baseHeight * 0.88, left: baseWidth * 0.80 },
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
      // Transforma { "12": "Fratura", "26": "Ausente" }
      // em [ { numero: 12, descricao: "Fratura" }, { numero: 26, descricao: "Ausente" } ]
      const odontogramaArray = Object.entries(dentesAvariados).map(
        ([numero, descricao]) => ({
          numero: parseInt(numero),
          descricao,
        })
      );

      await atualizarOdontogramaVitima(vitimaId as string, odontogramaArray);

      setModalSucessoVisible(true);
    } catch (error) {
      console.error('Erro ao salvar odontograma:', error);
      // Aqui você pode exibir uma mensagem ao usuário
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
    if (!vitimaId) return;

    try {
      setLoading(true);

      // Busca os dados do odontograma via backend
      const dados = await buscarOdontogramaVitima(vitimaId as string);

      // Transforma a lista em objeto: { '11': 'carie', '22': 'fratura' }
      const mapeado: Record<string, string> = {};
      dados.forEach((item) => {
        mapeado[item.numero.toString()] = item.descricao;
      });

      setDentesAvariados(mapeado);
      setModoVisualizacao(true); // ou false, dependendo se quer edição
    } catch (error) {
      console.error('Erro ao carregar odontograma:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("📦 useEffect disparado com odontogramaId:", vitimaId);

    if (vitimaId) {
      console.log("➡️ Chamando carregarOdontogramaExistente()");
      carregarOdontogramaExistente();
    } else {
      console.log("🆕 Nenhum odontogramaId - carregando novo");
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [vitimaId]);

  // ✅ Esse useEffect é só para logar quando dentesAvariados muda
  useEffect(() => {
    console.log("🦷 Estado atualizado dos dentes:", dentesAvariados);
  }, [dentesAvariados]);

  if (loading) {
    return (
      <View className="flex-1 bg-dentfyGray900">
        <HeaderPerito showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextSecondary mt-4">
            {vitimaId ? 'Carregando odontograma...' : 'Carregando...'}
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
            
            {/* Botão de Ativar Edição - Reposicionado para o header */}
            <TouchableOpacity
              onPress={() => setModoVisualizacao(prev => !prev)}
              className={`flex-row items-center justify-center px-4 py-3 rounded-xl shadow-lg border ${
                modoVisualizacao 
                  ? 'bg-dentfyAmber border-dentfyAmberHover' 
                  : 'bg-dentfyGray800 border-dentfyGray700'
              }`}
              style={{
                minWidth: 140,
                elevation: 4,
                shadowColor: modoVisualizacao ? colors.dentfyAmber : colors.dentfyGray700,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
              }}
            >
              <Ionicons 
                name={modoVisualizacao ? "create" : "eye"} 
                size={18} 
                color={modoVisualizacao ? colors.dentfyGray900 : colors.dentfyTextSecondary} 
              />
              <Body className={`ml-2 font-semibold text-sm text-center flex-1 ${
                modoVisualizacao ? 'text-dentfyGray900' : 'text-dentfyTextSecondary'
              }`}>
                {modoVisualizacao ? 'Editar' : 'Visualizar'}
              </Body>
            </TouchableOpacity>
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

          {/* Controles de Seleção - Dropdowns Separados em Cards Diferentes */}
          {!modoVisualizacao && (
            <>
              {/* Card 1 - Seleção de Dente */}
              <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30 mt-6">
                <View className="mb-4">
                  <Body className="text-dentfyTextSecondary font-medium text-lg">
                    Selecionar Dente
                  </Body>
                </View>

                <View>
                  <Body className="text-dentfyTextSecondary mb-2">Dente:</Body>
                  <View className="bg-dentfyGray800 rounded-lg border border-dentfyGray700">
                    <Picker
                      selectedValue={denteSelecionado}
                      onValueChange={(itemValue) => setDenteSelecionado(itemValue)}
                      style={{
                        color: colors.dentfyTextPrimary,
                        height: isIOS ? 150 : 50,
                        fontSize: 16
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
              </View>

              {/* Card 2 - Tipo de Avaria */}
              <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30 mt-6">
                <View className="mb-4">
                  <Body className="text-dentfyTextSecondary font-medium text-lg">
                    Tipo de Avaria
                  </Body>
                </View>

                <View>
                  <Body className="text-dentfyTextSecondary mb-2">Avaria:</Body>
                  <View className="bg-dentfyGray800 rounded-lg border border-dentfyGray700">
                    <Picker
                      selectedValue={avariaSelecionada}
                      onValueChange={(itemValue) => setAvariaSelecionada(itemValue)}
                      style={{
                        color: colors.dentfyTextPrimary,
                        height: isIOS ? 150 : 50,
                        fontSize: 16
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
              </View>

              {/* Card 3 - Botão Salvar Avaria */}
              <View className="bg-dentfyGray800/30 p-4 rounded-xl border border-dentfyGray700/30 mt-6">
                <View className="mb-4">
                  <Body className="text-dentfyTextSecondary font-medium text-lg">
                    Adicionar Avaria
                  </Body>
                </View>

                <TouchableOpacity
                  onPress={salvarAvaria}
                  disabled={!denteSelecionado || !avariaSelecionada}
                  className={`p-3 rounded-lg ${denteSelecionado && avariaSelecionada
                    ? 'bg-green-600'
                    : 'bg-dentfyGray700'
                    }`}
                >
                  <Body className={`text-center font-semibold ${denteSelecionado && avariaSelecionada
                    ? 'text-white'
                    : 'text-dentfyTextSecondary'
                    }`}>
                    Salvar Avaria
                  </Body>
                </TouchableOpacity>
              </View>
            </>
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
                console.log("Render dente:", numero, "Tipo:", tipo, "Posição:", pos);
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