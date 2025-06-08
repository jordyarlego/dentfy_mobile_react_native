'use client';

import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, TextInput, Alert, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '../../../../../components/header';
import { colors } from '../../../../../theme/colors';
import { useToast } from '../../../../../contexts/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Evidencia } from '../../../../../types/caso';
import FeedbackToast from '../../../../../components/caso/FeedbackToast';
import { Body } from '../../../../../components/Typography';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
};

export default function NovaEvidenciaPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showToast: showContextToast } = useToast();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Omit<Evidencia, '_id' | 'createdAt'>>({
    titulo: '',
    dataColeta: new Date().toISOString(),
    tipo: 'imagem',
    local: '',
    coletadaPor: '',
    descricao: '',
    imagemUri: undefined,
  });
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [toastConfig, setToastConfig] = useState<{
    mensagem: string;
    tipo: 'sucesso' | 'erro' | 'info';
  }>({
    mensagem: '',
    tipo: 'sucesso',
  });
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  // Adicionar log para debug
  console.log('ID do caso recebido:', id, 'Tipo:', typeof id);

  const handleImagePick = async (useCamera: boolean) => {
    try {
      const { status } = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        showContextToast('Permissão necessária', 'Precisamos de permissão para acessar a câmera/galeria.', 'error');
        return;
      }

      const result = await (useCamera 
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          }));

      if (!result.canceled) {
        setForm(prev => ({ ...prev, imagemUri: result.assets[0].uri }));
        showContextToast(
          'Imagem capturada', 
          useCamera ? 'Foto tirada com sucesso!' : 'Imagem selecionada com sucesso!', 
          'success'
        );
      }
    } catch (error) {
      console.error('Erro ao capturar/selecionar imagem:', error);
      showContextToast(
        'Erro ao capturar imagem', 
        'Não foi possível capturar/selecionar a imagem. Tente novamente.', 
        'error'
      );
    }
  };

  const handleImageEdit = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Permite edição
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setForm(prev => ({ ...prev, imagemUri: result.assets[0].uri }));
        showContextToast('Imagem atualizada', 'Imagem editada com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
      showContextToast('Erro ao editar imagem', 'Não foi possível editar a imagem. Tente novamente.', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!form.titulo || !form.dataColeta || !form.tipo || !form.local || !form.coletadaPor || !form.descricao) {
      setToastConfig({
        tipo: 'erro',
        mensagem: 'Por favor, preencha todos os campos obrigatórios',
      });
      setIsToastVisible(true);
      return;
    }

    setShowLoadingOverlay(true);
    try {
      console.log('Salvando evidência para caso:', id);
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      console.log('Casos carregados:', casosStr);

      if (!casosStr) {
        setShowLoadingOverlay(false);
        setToastConfig({
          tipo: 'erro',
          mensagem: 'Nenhum caso encontrado',
        });
        setIsToastVisible(true);
        return;
      }

      const casos = JSON.parse(casosStr);
      console.log('Total de casos:', casos.length);
      
      const casoIndex = casos.findIndex((c: any) => String(c._id) === String(id));
      console.log('Índice do caso:', casoIndex);
      
      if (casoIndex === -1) {
        setShowLoadingOverlay(false);
        setToastConfig({
          tipo: 'erro',
          mensagem: 'Caso não encontrado',
        });
        setIsToastVisible(true);
        return;
      }

      const novaEvidencia: Evidencia = {
        _id: Date.now().toString(),
        ...form,
        createdAt: new Date().toISOString(),
      };

      casos[casoIndex].evidencias = [...(casos[casoIndex].evidencias || []), novaEvidencia];
      
      await AsyncStorage.setItem(STORAGE_KEYS.CASOS, JSON.stringify(casos));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('Evidência salva com sucesso');

      setShowLoadingOverlay(false);
      setToastConfig({
        tipo: 'sucesso',
        mensagem: 'Evidência registrada com sucesso!',
      });
      setIsToastVisible(true);

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error('Erro ao salvar evidência:', error);
      setShowLoadingOverlay(false);
      setToastConfig({
        tipo: 'erro',
        mensagem: 'Não foi possível salvar a evidência',
      });
      setIsToastVisible(true);
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito showBackButton />
      <FeedbackToast
        visible={isToastVisible}
        mensagem={toastConfig.mensagem}
        tipo={toastConfig.tipo}
        onClose={() => setIsToastVisible(false)}
      />
      
      {/* Loading Overlay */}
      <Modal
        visible={showLoadingOverlay}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-overlayBlack items-center justify-center">
          <View className="bg-dentfyGray800 p-6 rounded-lg items-center">
            <ActivityIndicator size="large" color={colors.dentfyAmber} />
            <Body className="text-dentfyTextPrimary mt-4 text-center">
              Salvando evidência...
            </Body>
          </View>
        </View>
      </Modal>

      <View className="p-4">
        <View className="mb-6">
          <Text className="text-amber-500 mb-2 text-2xl font-bold">
            Nova Evidência
          </Text>
          <Text className="text-gray-300">
            Preencha os dados da evidência abaixo.
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="space-y-4">
          <View>
            <Text className="text-gray-300 mb-1">Título *</Text>
            <TextInput
              value={form.titulo}
              onChangeText={(text) => setForm(prev => ({ ...prev, titulo: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o título da evidência"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Data de Coleta *</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <Text className="text-white">
                {new Date(form.dataColeta).toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(form.dataColeta)}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setForm(prev => ({ ...prev, dataColeta: date.toISOString() }));
                  }
                }}
              />
            )}
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Local *</Text>
            <TextInput
              value={form.local}
              onChangeText={(text) => setForm(prev => ({ ...prev, local: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o local da coleta"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Coletada Por *</Text>
            <TextInput
              value={form.coletadaPor}
              onChangeText={(text) => setForm(prev => ({ ...prev, coletadaPor: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o nome do coletor"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Descrição *</Text>
            <TextInput
              value={form.descricao}
              onChangeText={(text) => setForm(prev => ({ ...prev, descricao: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite a descrição da evidência"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
            />
          </View>

          <View className="mt-6">
            <Text className="text-gray-300 mb-1">Tipo *</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => setForm(prev => ({ ...prev, tipo: 'imagem' }))}
                className={`flex-1 p-3 rounded-lg border ${form.tipo === 'imagem' ? 'bg-amber-600 border-amber-500' : 'bg-gray-800 border-gray-700'}`}
              >
                <Text className={`text-center ${form.tipo === 'imagem' ? 'text-white' : 'text-gray-300'}`}>Imagem</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setForm(prev => ({ ...prev, tipo: 'documento' }))}
                className={`flex-1 p-3 rounded-lg border ${form.tipo === 'documento' ? 'bg-amber-600 border-amber-500' : 'bg-gray-800 border-gray-700'}`}
              >
                <Text className={`text-center ${form.tipo === 'documento' ? 'text-white' : 'text-gray-300'}`}>Documento</Text>
              </TouchableOpacity>
            </View>
          </View>

          {form.tipo === 'imagem' && (
            <View className="mt-8 mb-4">
              <View className="flex-row justify-center gap-8">
                <TouchableOpacity
                  onPress={() => handleImagePick(false)}
                  className="items-center bg-gray-800 p-6 rounded-xl border border-gray-700"
                >
                  <Ionicons name="images-outline" size={48} color={colors.dentfyAmber} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleImagePick(true)}
                  className="items-center bg-gray-800 p-6 rounded-xl border border-gray-700"
                >
                  <Ionicons name="camera-outline" size={48} color={colors.dentfyAmber} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {form.imagemUri && (
            <View className="mt-6 mb-4">
              <TouchableOpacity onPress={handleImageEdit} activeOpacity={0.7}>
                <View className="relative">
                  <Image 
                    source={{ uri: form.imagemUri }} 
                    className="w-full h-48 rounded-lg" 
                    resizeMode="cover" 
                  />
                  <View className="absolute inset-0 bg-black/30 rounded-lg items-center justify-center opacity-0 hover:opacity-100">
                    <View className="bg-gray-800/80 p-3 rounded-full">
                      <Ionicons name="create-outline" size={24} color={colors.dentfyAmber} />
                    </View>
                  </View>
                </View>
                <Text className="text-gray-400 text-center mt-2">Toque para editar a imagem</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-4">
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <Text className="text-center text-gray-300">Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`flex-1 p-4 bg-amber-600 rounded-lg ${
              loading ? 'bg-amber-600/50' : ''
            }`}
          >
            <Text className="text-center text-white">{loading ? 'Salvando...' : 'Salvar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}