import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FeedbackToastProps {
  visible: boolean;
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'info';
  onClose: () => void;
  duracao?: number;
}

export default function FeedbackToast({
  visible,
  mensagem,
  tipo,
  onClose,
  duracao = 3000,
}: FeedbackToastProps) {
  const translateY = new Animated.Value(100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 100,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onClose();
        });
      }, duracao);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const getIcone = () => {
    switch (tipo) {
      case 'sucesso':
        return 'checkmark-circle';
      case 'erro':
        return 'close-circle';
      case 'info':
        return 'information-circle';
    }
  };

  const getCor = () => {
    switch (tipo) {
      case 'sucesso':
        return '#10B981';
      case 'erro':
        return '#EF4444';
      case 'info':
        return '#3B82F6';
    }
  };

  return (
    <Animated.View
      className="absolute bottom-0 left-0 right-0 p-4"
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        className="bg-gray-900 rounded-lg p-4 flex-row items-center"
        style={{ borderLeftWidth: 4, borderLeftColor: getCor() }}
      >
        <Ionicons name={getIcone()} size={24} color={getCor()} />
        <Text
          className="flex-1 ml-3 text-white"
          style={{ fontSize: 16 }}
        >
          {mensagem}
        </Text>
      </View>
    </Animated.View>
  );
} 