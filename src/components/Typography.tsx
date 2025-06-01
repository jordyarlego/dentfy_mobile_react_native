import React from 'react';
import { Text, TextProps } from 'react-native';
import { typography } from '../styles/theme';

type TypographyVariant = 'heading' | 'body';
type TypographySize = 'large' | 'medium' | 'small';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  size?: TypographySize;
  className?: string;
}

export function Heading({ size = 'medium', className = '', ...props }: TypographyProps) {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl',
  };

  return (
    <Text
      className={`font-bold ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

export function Body({ size = 'medium', className = '', ...props }: TypographyProps) {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  return (
    <Text
      className={`font-normal ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}

export const ButtonText = ({ style, ...props }: TextProps) => (
  <Text style={[typography.button, style]} {...props} />
);

export const Caption = ({ style, ...props }: TextProps) => (
  <Text style={[typography.caption, style]} {...props} />
); 