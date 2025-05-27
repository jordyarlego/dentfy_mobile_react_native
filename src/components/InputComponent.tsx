import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputTesteProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function InputTeste({
  label,
  placeholder = "",
  value,
  onChangeText,
  error,
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
      <TextInput
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className={`w-full px-4 py-2 border bg-[#F0F4F8] rounded-xl ${
          error
            ? "border-red-500"
            : "border-gray-300"
        }`}
        placeholderTextColor="#6B7280"
        {...rest}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}