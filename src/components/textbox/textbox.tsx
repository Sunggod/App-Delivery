import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Assegure-se de ter Feather Icons instalados
import tw from 'twrnc';

interface TextboxProps {
  label: string;
  placeholder: string;
  isPassword?: boolean;
  nameicon: keyof typeof Feather.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  width?: string;
}

export function Textbox({
  label,
  placeholder,
  isPassword = false,
  nameicon,
  value,
  onChangeText,
  width = 'w-75',
}: TextboxProps) {
  return (
    <View style={tw`flex flex-col mb-4`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Feather name={nameicon} size={20} color="red" style={tw`mr-2`} />
        <Text style={tw`text-lg text-gray-500`}>{label}</Text>
      </View>
      <TextInput
        style={tw`${width} p-3.5 bg-gray-50 text-black rounded-md border border-gray-300 flex-shrink-0`}
        placeholder={placeholder}
        placeholderTextColor="gray"
        secureTextEntry={isPassword}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
