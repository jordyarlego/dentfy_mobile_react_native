import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import { Body } from '../Typography';
import { colors } from '../../styles/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  visible: boolean;
  onHide: () => void;
}

const TOAST_DURATION = 3000;

export const Toast = ({ message, type = 'success', visible, onHide }: ToastProps) => {
  const translateY = new Animated.Value(-100);
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
        hideToast();
      }, TOAST_DURATION);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
      className={`absolute top-0 left-0 right-0 p-4 z-50 shadow-lg ${getBackgroundColor()}`}
    >
      <Body className="text-white text-center">{message}</Body>
    </Animated.View>
  );
}; 