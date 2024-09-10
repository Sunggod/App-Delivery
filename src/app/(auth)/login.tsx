import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderLogin from '../../components/headers/header.login';
import { Textbox } from '../../components/textbox/textbox';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../types';
import tw from 'twrnc';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigation = useNavigation<RootStackNavigationProp>();

  const handleLogin = async () => {
    try {
      const { user } = await login(email, password);
      if (user.status) {
        navigation.navigate('Main'); // Correção aqui
      } else if (user.id) {
        navigation.navigate('Register2', { userId: user.id }); // Correção aqui
      } else {
        Alert.alert(
          'Cadastro Incompleto',
          'Seu cadastro não está completo. Por favor, complete o registro para acessar a sua conta.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      Alert.alert('Erro ao fazer login', errorMessage);
    }
  };

  return (
    <GestureHandlerRootView style={tw`w-full h-full flex flex-col items-center justify-center p-20`}>
      <HeaderLogin text="Acesse sua conta..." />
      <View style={tw`flex gap-4 items-center`}>
        <Textbox
          label="E-mail"
          placeholder="Digite seu Email"
          nameicon="mail"
          value={email}
          onChangeText={setEmail}
        />
        <Textbox
          label="Senha"
          placeholder="Digite sua Senha"
          nameicon="lock"
          isPassword
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={tw`w-full items-center bg-red-400 pt-5 pb-5 pl-16 pr-16 rounded-2 justify-center`}
          onPress={handleLogin}
        >
          <Text style={tw`text-sm font-light text-white`}>Acessar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={tw`w-full items-center justify-center mt-10 flex-row gap-2`}
        onPress={() => navigation.navigate('Register')} // Correção aqui
      >
        <Feather style={tw`pt-10 animate-bounce`} name="arrow-right" size={16} />
        <Text style={tw`text-center text-gray-500 mt-10`}>Registra-se</Text>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

export default Login;
