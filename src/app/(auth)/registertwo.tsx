import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HeaderLogin from '../../components/headers/header.login';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import tw from 'twrnc';
import axios from 'axios';
import { RootStackParamList } from '../../../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api } from '../../Services/api';

type Register2ScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register2'>;
type Register2ScreenRouteProp = RouteProp<RootStackParamList, 'Register2'>;

const Register2: React.FC = () => {
  const navigation = useNavigation<Register2ScreenNavigationProp>();
  const route = useRoute<Register2ScreenRouteProp>();
  const [registerData, setRegisterData] = React.useState({
    id: '',
    endereco: '',
    bairro: '',
    cidade: '',
    uf: '',
    cep: '',
  });

  React.useEffect(() => {
    if (route.params?.userId) {
      setRegisterData(prev => ({ ...prev, id: route.params.userId }));
    }
  }, [route.params?.userId]);

  const handleCompleteRegister = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await api.post('/complete-register', registerData);
      Alert.alert('Sucesso', 'Registro completo com sucesso!');
      navigation.navigate('Login'); // Correção aqui
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Erro', error.response.data.message || 'Falha ao completar o registro. Tente novamente.');
      } else {
        Alert.alert('Erro', 'Falha ao completar o registro. Tente novamente.');
      }
    }
  };

  const validateFields = () => {
    const requiredFields = ['id', 'endereco', 'bairro', 'cidade', 'uf', 'cep'];
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
    icon: string
  ) => (
    <View style={tw`flex flex-col mb-4`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Feather name={icon} size={20} color="red" style={tw`mr-2`} />
        <Text style={tw`text-lg text-gray-500`}>{label}</Text>
      </View>
      <TextInput
        style={tw`w-75 p-3.5 bg-gray-50 text-black rounded-md border border-gray-300`}
        placeholder={placeholder}
        placeholderTextColor="gray"
        value={registerData[field]}
        onChangeText={(text) => {
        setRegisterData(prev => ({ ...prev, [field]: text }));
        }}
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`flex-grow justify-center items-center p-4`}>
        <HeaderLogin text="Complete seu registro" />
        <View style={tw`w-full max-w-sm`}>
          {renderTextbox('Endereço', 'endereco', 'Digite seu endereço', 'map-pin')}
          {renderTextbox('Bairro', 'bairro', 'Digite seu bairro', 'home')}
          {renderTextbox('Cidade', 'cidade', 'Digite sua cidade', 'map')}
          {renderTextbox('UF', 'uf', 'Digite sua UF', 'map')}
          {renderTextbox('CEP', 'cep', 'Digite seu CEP', 'map-pin')}
          <TouchableOpacity
            style={tw`w-full bg-red-400 py-4 rounded-lg mt-4`}
            onPress={handleCompleteRegister}
          >
            <Text style={tw`text-white text-center font-bold`}>Finalizar Registro</Text>
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

export default Register2;
