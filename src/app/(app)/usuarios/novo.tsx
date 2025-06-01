import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useToast } from '../../../contexts/ToastContext';
import InputComponent from '../../../components/InputComponent';
import { Picker } from '@react-native-picker/picker';
import HeaderPerito from '../../../components/header';
import { SafeAreaView } from 'react-native-safe-area-context';

interface FormData {
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  senha: string;
  confirmarSenha: string;
}

export default function NovoUsuario() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    cpf: '',
    cargo: 'perito',
    senha: '',
    confirmarSenha: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validações
    if (!formData.nome || !formData.email || !formData.cpf || !formData.cargo || !formData.senha || !formData.confirmarSenha) {
      showToast('Por favor, preencha todos os campos', 'error');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    if (formData.senha.length < 6) {
      showToast('A senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }

    // TODO: Implementar integração com API
    showToast('Usuário criado com sucesso!', 'success');
    router.push('/usuarios');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0E1A26]">
      <HeaderPerito showBackButton />
      <ScrollView className="flex-1">
        <View className="p-4 space-y-4">
          <InputComponent
            label="Nome"
            placeholder="Digite o nome"
            value={formData.nome}
            onChangeText={(text: string) => handleInputChange('nome', text)}
            className="bg-[#0E1A26] border-cyan-900/30 text-amber-100"
            placeholderTextColor="#94a3b8"
          />

          <InputComponent
            label="Email"
            placeholder="Digite o email"
            value={formData.email}
            onChangeText={(text: string) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-[#0E1A26] border-cyan-900/30 text-amber-100"
            placeholderTextColor="#94a3b8"
          />

          <InputComponent
            label="CPF"
            placeholder="Digite o CPF"
            value={formData.cpf}
            onChangeText={(text: string) => handleInputChange('cpf', text)}
            keyboardType="numeric"
            maxLength={11}
            className="bg-[#0E1A26] border-cyan-900/30 text-amber-100"
            placeholderTextColor="#94a3b8"
          />

          <View className="mb-4">
            <Text className="text-sm font-medium text-amber-100 mb-1">Cargo</Text>
            <View className="border border-cyan-900/30 rounded-lg bg-[#0E1A26]">
              <Picker
                selectedValue={formData.cargo}
                onValueChange={(value: string) => handleInputChange('cargo', value)}
                style={{ height: 50, color: '#0E1A26' }}
                dropdownIconColor="#0E1A26"
                mode="dropdown"
                itemStyle={{ backgroundColor: '#fef3c7', color: '#0E1A26' }}
              >
                <Picker.Item label="Perito" value="perito" color="#0E1A26" />
                <Picker.Item label="Assistente" value="assistente" color="#0E1A26" />
              </Picker>
            </View>
          </View>

          <InputComponent
            label="Senha"
            placeholder="Digite a senha"
            value={formData.senha}
            onChangeText={(text: string) => handleInputChange('senha', text)}
            secureTextEntry
            className="bg-[#0E1A26] border-cyan-900/30 text-amber-100"
            placeholderTextColor="#94a3b8"
          />

          <InputComponent
            label="Confirmar Senha"
            placeholder="Confirme a senha"
            value={formData.confirmarSenha}
            onChangeText={(text: string) => handleInputChange('confirmarSenha', text)}
            secureTextEntry
            className="bg-[#0E1A26] border-cyan-900/30 text-amber-100"
            placeholderTextColor="#94a3b8"
          />

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-amber-500 p-4 rounded-lg mt-4"
          >
            <Text className="text-[#0E1A26] text-center font-semibold text-lg">Criar Usuário</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}