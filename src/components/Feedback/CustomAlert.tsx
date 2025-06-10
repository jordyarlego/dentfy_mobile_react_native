import React from 'react';
import { View, Modal, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Body, Heading } from '../Typography';
import { colors } from '../../theme/colors';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onConfirm: () => void;
  confirmText?: string;
}

export const CustomAlert = ({ 
  visible, 
  title, 
  message, 
  type = 'info', 
  onConfirm, 
  confirmText = 'OK' 
}: CustomAlertProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.successGreenBackground,
          borderColor: colors.successGreen,
          iconColor: colors.successGreen,
          iconName: 'checkmark-circle' as const,
        };
      case 'error':
        return {
          backgroundColor: colors.errorRedBackground,
          borderColor: colors.errorRed,
          iconColor: colors.errorRed,
          iconName: 'close-circle' as const,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningYellowBackground,
          borderColor: colors.warningYellow,
          iconColor: colors.warningYellow,
          iconName: 'warning' as const,
        };
      case 'info':
      default:
        return {
          backgroundColor: colors.dentfyCyanBackground,
          borderColor: colors.dentfyCyan,
          iconColor: colors.dentfyCyan,
          iconName: 'information-circle' as const,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onConfirm}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View 
          className="bg-dentfyGray800 rounded-lg p-6 mx-4 border-2 max-w-sm"
          style={{ borderColor: styles.borderColor }}
        >
          {/* Header com ícone */}
          <View className="flex-row items-center mb-4">
            <Ionicons 
              name={styles.iconName} 
              size={24} 
              color={styles.iconColor} 
            />
            <Heading 
              size="medium" 
              className="ml-2 flex-1"
              style={{ color: styles.iconColor }}
            >
              {title}
            </Heading>
          </View>

          {/* Mensagem */}
          <Body className="text-dentfyTextPrimary mb-6 text-center">
            {message}
          </Body>

          {/* Botão de confirmação */}
          <TouchableOpacity
            onPress={onConfirm}
            className="bg-dentfyAmber py-3 px-6 rounded-lg items-center"
            activeOpacity={0.8}
          >
            <Body className="text-white font-semibold">
              {confirmText}
            </Body>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 