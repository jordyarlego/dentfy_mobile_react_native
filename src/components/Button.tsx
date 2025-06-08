import React from 'react';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { Body } from './Typography';
import { colors } from '../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const getBackgroundColor = () => {
    if (disabled) return colors.dentfyGray700;
    switch (variant) {
      case 'primary':
        return colors.dentfyAmber;
      case 'secondary':
        return colors.dentfyGray800;
      case 'outline':
        return 'transparent';
      default:
        return colors.dentfyAmber;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.dentfyGray500;
    switch (variant) {
      case 'primary':
        return colors.dentfyGray900;
      case 'secondary':
      case 'outline':
        return colors.dentfyTextPrimary;
      default:
        return colors.dentfyGray900;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.dentfyGray700;
    switch (variant) {
      case 'outline':
        return colors.dentfyAmber;
      default:
        return 'transparent';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`p-4 rounded-lg items-center justify-center ${className}`}
      style={{
        backgroundColor: getBackgroundColor(),
        borderWidth: variant === 'outline' ? 1 : 0,
        borderColor: getBorderColor(),
      }}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Body
          className="font-bold"
          style={{ color: getTextColor() }}
        >
          {title}
        </Body>
      )}
    </TouchableOpacity>
  );
} 