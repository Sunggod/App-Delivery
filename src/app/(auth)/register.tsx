import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderLogin from '../../components/headers/header.login';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import tw from 'twrnc';
import { api } from '../../Services/api';

type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const Register: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [registerData, setRegisterData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    if (!validateFields()) {
      return;
    }
  
    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
  
    try {
      await api.post('register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
      });
      navigation.navigate('Register2'); // Correção aqui
    } catch (error) {
      console.error('Erro ao registrar:', error);
      Alert.alert('Erro', 'Falha ao registrar. Tente novamente.');
    }
  };

  const validateFields = () => {
    const requiredFields = ['name', 'email', 'password', 'confirmPassword'];
    for (const field of requiredFields) {
      if (!registerData[field as keyof typeof registerData]) {
        Alert.alert('Erro', `O campo ${field} é obrigatório.`);
        return false;
      }
    }
    return true;
  };

  const renderTextbox = (
    label: string,
    field: keyof typeof registerData,
    placeholder: string,
    icon: string,
    isPassword: boolean = false
  ) => (
    <View style={tw`flex flex-col mb-4 w-full`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Feather name={icon} size={20} color="red" style={tw`mr-2`} />
        <Text style={tw`text-lg text-gray-500`}>{label}</Text>
      </View>
      <TextInput
        style={tw`w-full p-3.5 bg-gray-50 text-black rounded-md border border-gray-300`}
        placeholder={placeholder}
        placeholderTextColor="gray"
        secureTextEntry={isPassword}
        value={registerData[field]}
        onChangeText={(text) => setRegisterData(prev => ({ ...prev, [field]: text }))}
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center p-4`}>
        <HeaderLogin text="Criar sua conta" />
        <View style={tw`w-full max-w-sm items-center`}>
          {renderTextbox('Nome Completo', 'name', 'Digite seu nome', 'user-check')}
          {renderTextbox('Email', 'email', 'Digite seu email', 'mail')}
          {renderTextbox('Escolha uma senha', 'password', 'Digite sua senha', 'lock', true)}
          {renderTextbox('Confirme sua senha', 'confirmPassword', 'Digite sua senha novamente', 'lock', true)}
          <TouchableOpacity
            style={tw`w-full bg-red-400 py-4 rounded-lg mt-4`}
            onPress={handleRegister}
          >
            <Text style={tw`text-white text-center font-bold`}>Próximo</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={tw`flex-row items-center justify-center mt-6`}
          onPress={() => navigation.navigate('Login')} // Correção aqui
        >
          <Feather name="arrow-right" size={16} style={tw`mr-2`} />
          <Text style={tw`text-gray-500 text-sm`}>Acessar minha conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default Register;
