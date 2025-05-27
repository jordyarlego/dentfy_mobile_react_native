// src/app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      {/* Adicione outras rotas de autenticação aqui, como "cadastro" */}
    </Stack>
  );
}