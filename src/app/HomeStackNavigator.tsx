import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './(auth)/Home'; // Supondo que Home é sua tela principal
import CartScreen from './(auth)/Cart'; // Tela do carrinho
import ProfileScreen from './(auth)/Profile'; // Tela do perfil

const HomeStack = createNativeStackNavigator();

const HomeStackNavigator: React.FC = () => {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen" component={Home} />
      <HomeStack.Screen name="CartScreen" component={CartScreen} />
      <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;
