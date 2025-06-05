import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface InputTesteProps extends TextInputProps {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  isPasswordVisible?: boolean;
  onTogglePassword?: () => void;
}

export default function InputTeste({
  label,
  placeholder = "",
  value,
  onChangeText,
  error,
  showPasswordToggle,
  isPasswordVisible,
  onTogglePassword,
  ...rest
}: InputTesteProps) {
  const inputId = rest.id || (label ? label.toLowerCase().replace(/\s/g, "-") : undefined);

  return (
    <View className="w-full mb-4">
      {label && (
        <Text
          className="mb-1 text-sm font-medium text-cyan-100"
        >
          {label}
        </Text>
      )}
      <View className="relative">
        <TextInput
          id={inputId}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className={`w-full px-4 py-2 border bg-[#F0F4F8] rounded-xl ${
            error
              ? "border-red-500"
              : "border-gray-300"
          } ${showPasswordToggle ? 'pr-12' : ''}`}
          placeholderTextColor="#6B7280"
          {...rest}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}