import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkAuth();
  }, []);

  // Efeito para monitorar mudanças na autenticação
  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';
    
    console.log('=== MONITORAMENTO DE AUTENTICAÇÃO ===');
    console.log('Estado atual:', { isAuthenticated, inAuthGroup });
    
    if (isAuthenticated && inAuthGroup) {
      console.log('Usuário autenticado em grupo de auth, redirecionando para casos...');
      router.replace('/(app)/casos');
    } else if (!isAuthenticated && !inAuthGroup) {
      console.log('Usuário não autenticado fora do grupo de auth, redirecionando para login...');
      router.replace('/login');
    }
  }, [isAuthenticated, segments]);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token encontrado:', !!token);
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token: string) => {
    try {
      console.log('=== INÍCIO DO SIGN IN ===');
      console.log('Salvando token...');
      await AsyncStorage.setItem('token', token);
      
      console.log('Atualizando estado de autenticação...');
      setIsAuthenticated(true);
      
      console.log('=== FIM DO SIGN IN ===');
    } catch (error) {
      console.error('Erro ao salvar token:', error);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('=== SIGN OUT ===');
      console.log('Removendo dados do usuário...');
      
      // Limpar todos os dados do usuário
      await AsyncStorage.multiRemove([
        'token',
        '@dentfy:usuario',
        'user',
        '@dentfy_casos',
        '@dentfy_caso_vitimas',
        '@dentfy_caso_evidencias'
      ]);
      
      console.log('Dados removidos, atualizando estado...');
      setIsAuthenticated(false);
      
      console.log('=== FIM DO SIGN OUT ===');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Mesmo com erro, força o estado como não autenticado
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
