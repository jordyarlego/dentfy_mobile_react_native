export const fonts = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
} as const;

export const colors = {
  primary: '#2196F3',
  secondary: '#FFC107',
  success: '#4CAF50',
  error: '#F44336',
  info: '#2196F3',
  warning: '#FF9800',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
} as const;

export const typography = {
  heading: {
    large: {
      fontFamily: fonts.bold,
      fontSize: 32,
      fontWeight: '700',
    },
    medium: {
      fontFamily: fonts.bold,
      fontSize: 24,
      fontWeight: '700',
    },
    small: {
      fontFamily: fonts.bold,
      fontSize: 20,
      fontWeight: '700',
    },
  },
  body: {
    large: {
      fontFamily: fonts.regular,
      fontSize: 18,
      fontWeight: '400',
    },
    medium: {
      fontFamily: fonts.regular,
      fontSize: 16,
      fontWeight: '400',
    },
    small: {
      fontFamily: fonts.regular,
      fontSize: 14,
      fontWeight: '400',
    },
  },
  button: {
    fontFamily: fonts.medium,
    fontSize: 16,
    fontWeight: '500',
  },
  caption: {
    fontFamily: fonts.regular,
    fontSize: 12,
    fontWeight: '400',
  },
} as const;

// Exemplo de uso:
// import { typography } from '@styles/theme';
// 
// const styles = StyleSheet.create({
//   title: typography.heading.medium,
//   text: typography.body.medium,
//   buttonText: typography.button,
// }); 