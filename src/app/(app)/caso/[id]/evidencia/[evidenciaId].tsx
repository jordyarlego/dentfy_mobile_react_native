import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Alert, Modal, ActivityIndicator, Image, Dimensions, StatusBar, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '@/components/header';
import { Body, Heading } from '@/components/Typography';
import { colors } from '@/theme/colors';
import type { Evidencia } from '@/services/api_evidencia';
import { buscarEvidenciasPorCaso, atualizarEvidencia } from '@/services/api_evidencia';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function DetalhesEvidencia() {
  const { id: casoId, evidenciaId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Evidencia | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (typeof evidenciaId === 'string' && typeof casoId === 'string') {
      carregarEvidencia();
    }
  }, [evidenciaId, casoId]);

  const carregarEvidencia = async () => {
    try {
      setLoading(true);
      const evidencias = await buscarEvidenciasPorCaso(casoId as string);
      const evidencia = evidencias.find(e => e._id === evidenciaId);
      
      if (!evidencia) {
        throw new Error('Evidência não encontrada');
      }
      
      setFormData(evidencia);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar evidência', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Evidencia, value: any) => {
    if (!formData) return;
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSubmit = async () => {
    if (!formData || !evidenciaId) return;

    // Validar campos obrigatórios
    const camposObrigatorios: (keyof Omit<Evidencia, '_id' | 'createdAt' | 'imagemURL' | 'latitude' | 'longitude'>)[] = [
      'titulo',
      'descricao',
      'tipo',
      'coletadoPor',
      'dataColeta',
      'localColeta',
    ];

    const camposFaltantes = camposObrigatorios.filter(
      campo => !formData[campo] || formData[campo]?.toString().trim() === ''
    );

    if (camposFaltantes.length > 0) {
      Alert.alert(
        'Campos obrigatórios',
        'Por favor, preencha todos os campos obrigatórios.'
      );
      return;
    }

    try {
      setSaving(true);
      await atualizarEvidencia(evidenciaId as string, formData);
      setEditing(false);
      Alert.alert('Sucesso', 'Evidência atualizada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao atualizar evidência');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Aqui a equipe do back-end implementará a chamada da API
    console.log('Deletando evidência:', evidenciaId);
    
    // Por enquanto, apenas fecha o modal e volta para a lista
    setShowDeleteModal(false);
    Alert.alert('Sucesso', 'Evidência deletada com sucesso!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const formatarData = (data: string | Date) => {
    if (!data) return '';
    try {
      const date = new Date(data);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return String(data);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'imagem':
        return 'image';
      case 'texto':
        return 'document-text';
      default:
        return 'document';
    }
  };

  if (loading || !formData) {
    return (
      <View className="flex-1 bg-dentfyGray900">
        <HeaderPerito showBackButton />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.dentfyAmber} />
          <Body className="text-dentfyTextSecondary mt-4">Carregando evidência...</Body>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-dentfyGray900">
      <HeaderPerito showBackButton />
      
      <ScrollView className="flex-1 p-4">
        {/* Header da Evidência */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Heading size="large" className="text-dentfyAmber mb-2">
                {editing ? 'Editar Evidência' : formData.titulo}
              </Heading>
              <Body className="text-dentfyTextSecondary">
                {editing ? 'Atualize os dados da evidência abaixo.' : 'Detalhes da evidência'}
              </Body>
            </View>
            
            <View className="flex-row items-center gap-2">
              {!editing && (
                <>
                  <TouchableOpacity
                    onPress={() => setEditing(true)}
                    className="p-3 rounded-full bg-dentfyAmber/10"
                  >
                    <Ionicons name="pencil" size={20} color={colors.dentfyAmber} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleDelete}
                    className="p-3 rounded-full bg-errorRed/10"
                  >
                    <Ionicons name="trash" size={20} color={colors.errorRed} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>

        {editing ? (
          /* Formulário de Edição */
          <View className="space-y-4">
            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">Título *</Body>
              <TextInput
                value={formData.titulo}
                onChangeText={(value) => handleChange('titulo', value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o título"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">Descrição *</Body>
              <TextInput
                value={formData.descricao}
                onChangeText={(value) => handleChange('descricao', value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite a descrição"
                placeholderTextColor="#6B7280"
                multiline
                numberOfLines={4}
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">Tipo *</Body>
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => handleChange('tipo', 'imagem')}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.tipo === 'imagem'
                      ? 'bg-dentfyAmber border-amber-500'
                      : 'bg-dentfyGray800 border-dentfyGray700'
                  }`}
                >
                  <Body
                    className={`text-center ${
                      formData.tipo === 'imagem'
                        ? 'text-white'
                        : 'text-dentfyTextSecondary'
                    }`}
                  >
                    Imagem
                  </Body>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleChange('tipo', 'texto')}
                  className={`flex-1 p-3 rounded-lg border ${
                    formData.tipo === 'texto'
                      ? 'bg-dentfyAmber border-amber-500'
                      : 'bg-dentfyGray800 border-dentfyGray700'
                  }`}
                >
                  <Body
                    className={`text-center ${
                      formData.tipo === 'texto'
                        ? 'text-white'
                        : 'text-dentfyTextSecondary'
                    }`}
                  >
                    Documento
                  </Body>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">Coletado por *</Body>
              <TextInput
                value={formData.coletadoPor}
                onChangeText={(value) => handleChange('coletadoPor', value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o nome do coletor"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">Data de coleta *</Body>
              <TextInput
                value={String(formData.dataColeta)}
                onChangeText={(value) => handleChange('dataColeta', value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Body className="text-base text-dentfyTextSecondary mb-1">Local de coleta *</Body>
              <TextInput
                value={formData.localColeta}
                onChangeText={(value) => handleChange('localColeta', value)}
                className="bg-dentfyGray800 text-white p-3 rounded-lg border border-dentfyGray700"
                placeholder="Digite o local"
                placeholderTextColor="#6B7280"
              />
            </View>

            <View className="flex-row gap-4 mt-6">
              <TouchableOpacity
                onPress={() => setEditing(false)}
                className="flex-1 p-4 bg-dentfyGray800 rounded-lg border border-dentfyGray700"
              >
                <Body className="text-center text-dentfyTextSecondary">Cancelar</Body>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={saving}
                className="flex-1 p-4 bg-dentfyAmber rounded-lg"
              >
                <Body className="text-center text-white">
                  {saving ? 'Salvando...' : 'Salvar'}
                </Body>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Visualização dos Detalhes */
          <View className="space-y-4">
            {/* Informações Básicas */}
            <View className="bg-dentfyGray800/30 p-4 rounded-lg">
              <View className="flex-row items-center mb-3">
                <Ionicons name="document-text" size={24} color={colors.dentfyAmber} />
                <Heading size="medium" className="text-dentfyTextPrimary ml-2">
                  Informações Básicas
                </Heading>
              </View>
              
              <View className="space-y-3">
                <View className="flex-row items-center">
                  <Ionicons name={getTipoIcon(formData.tipo)} size={20} color={colors.dentfyTextSecondary} />
                  <Body className="text-dentfyTextSecondary ml-3 flex-1">Tipo:</Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formData.tipo === 'imagem' ? 'Imagem' : 'Documento'}
                  </Body>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="person-outline" size={20} color={colors.dentfyTextSecondary} />
                  <Body className="text-dentfyTextSecondary ml-3 flex-1">Coletado por:</Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formData.coletadoPor || 'Não informado'}
                  </Body>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color={colors.dentfyTextSecondary} />
                  <Body className="text-dentfyTextSecondary ml-3 flex-1">Data de Coleta:</Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formatarData(formData.dataColeta)}
                  </Body>
                </View>
                
                <View className="flex-row items-center">
                  <Ionicons name="location" size={20} color={colors.dentfyTextSecondary} />
                  <Body className="text-dentfyTextSecondary ml-3 flex-1">Local:</Body>
                  <Body className="text-dentfyTextPrimary font-medium">
                    {formData.localColeta}
                  </Body>
                </View>
              </View>
            </View>

            {/* Descrição */}
            <View className="bg-dentfyGray800/30 p-4 rounded-lg">
              <View className="flex-row items-center mb-3">
                <Ionicons name="text" size={24} color={colors.dentfyAmber} />
                <Heading size="medium" className="text-dentfyTextPrimary ml-2">
                  Descrição
                </Heading>
              </View>
              
              <Body className="text-dentfyTextPrimary">
                {formData.descricao}
              </Body>
            </View>

            {/* Imagem */}
            {formData.imagemURL && (
              <View className="bg-dentfyGray800/30 p-4 rounded-lg">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="image" size={24} color={colors.dentfyAmber} />
                  <Heading size="medium" className="text-dentfyTextPrimary ml-2">
                    Imagem
                  </Heading>
                </View>
                
                <TouchableOpacity
                  onPress={() => setSelectedImage(formData.imagemURL || null)}
                  className="relative"
                >
                  <Image
                    source={{ uri: formData.imagemURL }}
                    className="w-full h-64 rounded-lg"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-4 right-4 bg-dentfyGray800/80 p-3 rounded-full">
                    <Ionicons name="expand-outline" size={24} color={colors.dentfyAmber} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Coordenadas (se disponíveis) */}
            {(formData.latitude || formData.longitude) && (
              <View className="bg-dentfyGray800/30 p-4 rounded-lg">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="map" size={24} color={colors.dentfyAmber} />
                  <Heading size="medium" className="text-dentfyTextPrimary ml-2">
                    Localização
                  </Heading>
                </View>
                
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={20} color={colors.dentfyTextSecondary} />
                    <Body className="text-dentfyTextSecondary ml-3 flex-1">Latitude:</Body>
                    <Body className="text-dentfyTextPrimary font-medium">
                      {formData.latitude?.toFixed(6)}
                    </Body>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Ionicons name="location-outline" size={20} color={colors.dentfyTextSecondary} />
                    <Body className="text-dentfyTextSecondary ml-3 flex-1">Longitude:</Body>
                    <Body className="text-dentfyTextPrimary font-medium">
                      {formData.longitude?.toFixed(6)}
                    </Body>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de Imagem em Tela Cheia */}
      <Modal
        visible={!!selectedImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
        statusBarTranslucent
      >
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Pressable
          onPress={() => setSelectedImage(null)}
          className="flex-1 bg-black"
        >
          <View className="flex-1 items-center justify-center">
            <Image
              source={{ uri: selectedImage || "" }}
              style={{
                width: screenWidth,
                height: screenHeight * 0.8,
              }}
              resizeMode="contain"
            />
          </View>
          <View className="absolute top-12 right-4">
            <Pressable
              onPress={() => setSelectedImage(null)}
              className="bg-dentfyGray800/80 p-3 rounded-full"
            >
              <Ionicons
                name="close"
                size={24}
                color={colors.dentfyTextPrimary}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Modal de Confirmação de Delete */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
        statusBarTranslucent
      >
        <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
        <Pressable
          onPress={() => setShowDeleteModal(false)}
          className="flex-1 bg-black/50"
        >
          <View className="flex-1 items-center justify-center p-4">
            <View className="bg-dentfyGray800 rounded-2xl p-6 w-full max-w-sm border border-dentfyGray700">
              {/* Ícone de Aviso */}
              <View className="items-center mb-4">
                <View className="w-16 h-16 bg-errorRed/20 rounded-full items-center justify-center mb-3">
                  <Ionicons name="warning" size={32} color={colors.errorRed} />
                </View>
                <Heading size="medium" className="text-dentfyTextPrimary text-center">
                  Deletar Evidência
                </Heading>
              </View>

              {/* Mensagem */}
              <Body className="text-dentfyTextSecondary text-center mb-6 leading-6">
                Tem certeza que deseja deletar esta evidência? Esta ação não pode ser desfeita.
              </Body>

              {/* Botões */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowDeleteModal(false)}
                  className="flex-1 p-4 bg-dentfyGray700 rounded-lg border border-dentfyGray600"
                >
                  <Body className="text-center text-dentfyTextSecondary font-medium">
                    Cancelar
                  </Body>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={confirmDelete}
                  className="flex-1 p-4 bg-errorRed rounded-lg"
                >
                  <Body className="text-center text-white font-medium">
                    Deletar
                  </Body>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
} 