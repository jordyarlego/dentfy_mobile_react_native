import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Text, TextInput, ActivityIndicator, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import HeaderPerito from '../../../../../components/header';
import { colors } from '../../../../../theme/colors';
import { useToast } from '../../../../../contexts/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { 
  Evidencia, 
  EvidenciaFormState, 
  NovaEvidenciaState, 
  Caso,
  ImagePickerResponse,
  DateTimePickerResponse
} from '../../../../../types/evidencia';
import { Body } from '../../../../../components/Typography';

const STORAGE_KEYS = {
  CASOS: '@dentify_casos',
} as const;

export default function NovaEvidenciaPage() {
  const { id: rawId } = useLocalSearchParams();
  const caseId = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();
  const { showToast } = useToast();

  const [state, setState] = useState<NovaEvidenciaState>({
    isSubmitting: false,
    isSaved: false,
    showDatePicker: false,
    form: {
      titulo: '',
      dataColeta: new Date().toISOString(),
      tipo: 'imagem',
      local: '',
      coletadaPor: '',
      descricao: '',
      imagemUri: undefined,
    },
  });

  const setForm = (updater: (prev: EvidenciaFormState) => EvidenciaFormState) => {
    setState((prev: NovaEvidenciaState) => ({ ...prev, form: updater(prev.form) }));
  };

  const handleImagePick = async (useCamera: boolean): Promise<void> => {
    try {
      const { status } = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        showToast('Precisamos de permissão para acessar a câmera/galeria.', 'error');
        return;
      }

      const result = await (useCamera 
        ? ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
          })
        : ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
          })) as ImagePickerResponse;

      if (!result.canceled && result.assets[0]) {
        setForm(prev => ({ ...prev, imagemUri: result.assets[0].uri }));
        showToast(
          useCamera ? 'Foto tirada com sucesso!' : 'Imagem selecionada com sucesso!',
          'success'
        );
      }
    } catch (error) {
      console.error('Erro ao capturar/selecionar imagem:', error);
      showToast(
        'Não foi possível capturar/selecionar a imagem. Tente novamente.',
        'error'
      );
    }
  };

  const handleImageEdit = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      }) as ImagePickerResponse;

      if (!result.canceled && result.assets[0]) {
        setForm(prev => ({ ...prev, imagemUri: result.assets[0].uri }));
        showToast('Imagem editada com sucesso!', 'success');
      }
    } catch (error) {
      console.error('Erro ao editar imagem:', error);
      showToast('Não foi possível editar a imagem. Tente novamente.', 'error');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    if (!caseId) {
      showToast('ID do caso inválido', 'error');
      return;
    }

    if (!state.form.titulo || !state.form.dataColeta || !state.form.tipo || !state.form.local || !state.form.coletadaPor || !state.form.descricao) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    try {
      setState((prev: NovaEvidenciaState) => ({ ...prev, isSubmitting: true, isSaved: false }));

      console.log('Salvando evidência para caso:', caseId);
      const casosStr = await AsyncStorage.getItem(STORAGE_KEYS.CASOS);
      console.log('Casos carregados:', casosStr);

      if (!casosStr) {
        showToast('Nenhum caso encontrado', 'error');
        setState((prev: NovaEvidenciaState) => ({ ...prev, isSubmitting: false }));
        return;
      }

      const casos = JSON.parse(casosStr) as Caso[];
      console.log('Total de casos:', casos.length);
      
      const casoIndex = casos.findIndex((c: Caso) => String(c._id) === String(caseId));
      console.log('Índice do caso:', casoIndex);
      
      if (casoIndex === -1) {
        showToast('Caso não encontrado', 'error');
        setState((prev: NovaEvidenciaState) => ({ ...prev, isSubmitting: false }));
        return;
      }

      const novaEvidencia: Evidencia = {
        _id: Date.now().toString(),
        ...state.form,
        createdAt: new Date().toISOString(),
      };

      casos[casoIndex].evidencias = [...(casos[casoIndex].evidencias || []), novaEvidencia];
      
      await AsyncStorage.setItem(STORAGE_KEYS.CASOS, JSON.stringify(casos));
      
      // Aguarda um momento para garantir que o AsyncStorage foi atualizado
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      console.log('Evidência salva com sucesso');
      
      // Atualiza o estado para mostrar o sucesso
      setState((prev: NovaEvidenciaState) => ({ ...prev, isSaved: true }));
      
      // Aguarda mais um momento para mostrar a mensagem de sucesso
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Volta para a tela anterior
      router.back();
    } catch (error) {
      console.error('Erro ao salvar evidência:', error);
      showToast('Não foi possível salvar a evidência', 'error');
      setState((prev: NovaEvidenciaState) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setState((prev: NovaEvidenciaState) => ({ ...prev, showDatePicker: false }));
    if (date) {
      setForm((prev: EvidenciaFormState) => ({ ...prev, dataColeta: date.toISOString() }));
    }
  };

  return (
    <View className="flex-1 bg-gray-900">
      <HeaderPerito showBackButton />
      
      {/* Loading/Success Overlay */}
      <Modal
        visible={state.isSubmitting}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="bg-dentfyGray800 p-8 rounded-lg items-center min-w-[200px]">
            {state.isSaved ? (
              <>
                <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center mb-4">
                  <Ionicons name="checkmark" size={40} color="white" />
                </View>
                <Body className="text-dentfyTextPrimary text-center text-lg font-medium">
                  Evidência salva com sucesso!
                </Body>
              </>
            ) : (
              <>
                <ActivityIndicator size="large" color={colors.dentfyAmber} />
                <Body className="text-dentfyTextPrimary mt-4 text-center text-lg">
                  Salvando evidência...
                </Body>
              </>
            )}
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
              value={state.form.titulo}
              onChangeText={(text: string) => setForm((prev: EvidenciaFormState) => ({ ...prev, titulo: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o título da evidência"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Data de Coleta *</Text>
            <TouchableOpacity
              onPress={() => setState((prev: NovaEvidenciaState) => ({ ...prev, showDatePicker: true }))}
              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <Text className="text-white">
                {new Date(state.form.dataColeta).toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>
            {state.showDatePicker && (
              <DateTimePicker
                value={new Date(state.form.dataColeta)}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Local *</Text>
            <TextInput
              value={state.form.local}
              onChangeText={(text: string) => setForm((prev: EvidenciaFormState) => ({ ...prev, local: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o local da coleta"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Coletada Por *</Text>
            <TextInput
              value={state.form.coletadaPor}
              onChangeText={(text: string) => setForm((prev: EvidenciaFormState) => ({ ...prev, coletadaPor: text }))}
              className="bg-gray-800 text-white p-3 rounded-lg border border-gray-700"
              placeholder="Digite o nome do coletor"
              placeholderTextColor="#6B7280"
            />
          </View>

          <View>
            <Text className="text-gray-300 mb-1">Descrição *</Text>
            <TextInput
              value={state.form.descricao}
              onChangeText={(text: string) => setForm((prev: EvidenciaFormState) => ({ ...prev, descricao: text }))}
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
                onPress={() => setForm((prev: EvidenciaFormState) => ({ ...prev, tipo: 'imagem' }))}
                className={`flex-1 p-3 rounded-lg border ${state.form.tipo === 'imagem' ? 'bg-amber-600 border-amber-500' : 'bg-gray-800 border-gray-700'}`}
              >
                <Text className={`text-center ${state.form.tipo === 'imagem' ? 'text-white' : 'text-gray-300'}`}>
                  Imagem
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setForm((prev: EvidenciaFormState) => ({ ...prev, tipo: 'documento' }))}
                className={`flex-1 p-3 rounded-lg border ${state.form.tipo === 'documento' ? 'bg-amber-600 border-amber-500' : 'bg-gray-800 border-gray-700'}`}
              >
                <Text className={`text-center ${state.form.tipo === 'documento' ? 'text-white' : 'text-gray-300'}`}>
                  Documento
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {state.form.tipo === 'imagem' && (
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

          {state.form.imagemUri && (
            <View className="mt-6 mb-4">
              <TouchableOpacity onPress={handleImageEdit} activeOpacity={0.7}>
                <View className="relative">
                  <Image 
                    source={{ uri: state.form.imagemUri }} 
                    className="w-full h-48 rounded-lg" 
                    resizeMode="cover" 
                  />
                  <View className="absolute inset-0 bg-black/30 rounded-lg items-center justify-center">
                    <View className="bg-gray-800/80 p-3 rounded-full">
                      <Ionicons name="create-outline" size={24} color={colors.dentfyAmber} />
                    </View>
                  </View>
                </View>
                <Text className="text-gray-400 text-center mt-2">
                  Toque para editar a imagem
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="p-4">
        <View className="flex-row gap-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700"
            disabled={state.isSubmitting}
          >
            <Text className="text-center text-gray-300">
              Cancelar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={state.isSubmitting}
            className={`flex-1 p-4 bg-amber-600 rounded-lg ${
              state.isSubmitting ? 'bg-amber-600/50' : ''
            }`}
          >
            <Text className="text-center text-white">
              {state.isSubmitting ? (state.isSaved ? 'Salvo!' : 'Salvando...') : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}