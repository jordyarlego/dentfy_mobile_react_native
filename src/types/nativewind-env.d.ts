/// <reference types="nativewind/types" />

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface TextInputProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
  interface ScrollViewProps {
    className?: string;
  }
}

declare module 'nativewind' {
  import type { ViewProps, TextProps, TextInputProps, TouchableOpacityProps, ScrollViewProps } from 'react-native';

  export type StyledView = ViewProps;
  export type StyledText = TextProps;
  export type StyledTextInput = TextInputProps;
  export type StyledTouchableOpacity = TouchableOpacityProps;
  export type StyledScrollView = ScrollViewProps;
} 