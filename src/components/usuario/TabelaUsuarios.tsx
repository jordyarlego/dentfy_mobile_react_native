import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import type { Usuario } from '../../types/usuario';
import ModalVisualizacaoUsuario from './ModalVisualizacaoUsuario';
import { useToast } from '../../contexts/ToastContext';
import { useRouter } from 'expo-router';

const STORAGE_KEY = '@dentify_usuarios';

// Dados mockados de usuários
const MOCK_USERS: Usuario[] = [
  {
    _id: 'user1',
    name: 'Usuário Perito 1',
    email: 'perito1@example.com',
    cpf: '111.111.111-11',
    role: 'perito',
    status: 'ativo',
  },
  {
    _id: 'user2',
    name: 'Usuário Assistente 1',
    email: 'assistente1@example.com',
    cpf: '222.222.222-22',
    role: 'assistente',
    status: 'ativo',
  },
  {
    _id: 'user3',
    name: 'Usuário Perito 2 (Inativo)',
    email: 'perito2inativo@example.com',
    cpf: '333.333.333-33',
    role: 'perito',
    status: 'inativo',
  },
];

export default function TabelaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = useCallback(async () => {
    try {
      const storedUsuarios = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUsuarios) {
        setUsuarios(JSON.parse(storedUsuarios));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS));
        setUsuarios(MOCK_USERS);
      }
    } catch (error) {
      showToast('Erro ao carregar usuários', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUsuarios();
    setRefreshing(false);
  }, [loadUsuarios]);

  const saveUsuarios = async (usuariosToSave: Usuario[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usuariosToSave));
      setUsuarios(usuariosToSave);
    } catch (error) {
      showToast('Erro ao salvar usuários', 'error');
    }
  };

  const handleUserPress = (usuario: Usuario) => {
    setSelectedUser(usuario);
    setModalVisible(true);
  };

  const handleEditUser = (usuario: Usuario) => {
    showToast('Funcionalidade de edição ainda não implementada', 'info');
    console.log('Editar usuário:', usuario);
    setModalVisible(false);
  };

  const handleDeleteUser = (_id: string) => {
    const usuariosAtualizados = usuarios.filter((user) => user._id !== _id);
    saveUsuarios(usuariosAtualizados);
    setModalVisible(false);
    showToast('Usuário excluído com sucesso!', 'success');
  };

  const handleAddUser = () => {
    router.push('/usuarios/novo');
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.name.toLowerCase().includes(search.toLowerCase()) ||
    usuario.email.toLowerCase().includes(search.toLowerCase()) ||
    usuario.cpf.includes(search)
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text className="text-gray-400 mt-4">Carregando usuários...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Campo de Busca */}
       <View className="mb-4">
        <TextInput
          className="w-full px-4 py-2 bg-gray-800 text-gray-100 rounded-lg border border-gray-700"
          placeholder="Buscar usuário (Nome, Email, CPF)"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Botão Adicionar */}
      <TouchableOpacity 
        onPress={handleAddUser}
        className="flex-row items-center justify-center gap-2 px-4 py-3 bg-amber-600 rounded-lg mb-4"
      >
         <Ionicons name="add-circle-outline" size={20} color="#0E1A26" />
         <Text className="text-[#0E1A26] font-medium">Adicionar Novo Usuário</Text>
      </TouchableOpacity>

      {/* Lista de Usuários */}
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F59E0B']}
            tintColor={'#F59E0B'}
          />
        }
      >
        {usuariosFiltrados.length > 0 ? (
          usuariosFiltrados.map((usuario) => (
            <TouchableOpacity
              key={usuario._id}
              className="bg-gray-800/30 p-4 rounded-lg mb-3 border border-gray-700"
              onPress={() => handleUserPress(usuario)}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-2">
                  <Text className="text-lg font-bold text-gray-100">{usuario.name}</Text>
                  <Text className="text-gray-400 text-sm">{usuario.role}</Text>
                </View>
                 <View className="flex-row items-center">
                     {usuario.status === 'ativo' ? (
                          <View className="bg-green-500/20 px-2 py-1 rounded-full">
                              <Text className="text-green-400 text-xs font-medium">Ativo</Text>
                          </View>
                      ) : (
                           <View className="bg-red-500/20 px-2 py-1 rounded-full">
                              <Text className="text-red-400 text-xs font-medium">Inativo</Text>
                          </View>
                      )}
                      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" className="ml-1"/>
                 </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Ionicons name="people-outline" size={50} color="#6B7280" />
            <Text className="text-gray-400 mt-4">Nenhum usuário encontrado.</Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de Visualização */}
      <ModalVisualizacaoUsuario
        visible={modalVisible}
        usuario={selectedUser}
        onClose={() => setModalVisible(false)}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </View>
  );
} 