import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './(auth)/login';
import Register from './(auth)/register';
import Register2 from './(auth)/registertwo';
import HomeStackNavigator from './HomeStackNavigator'; // Importando o HomeStackNavigator
import Cart from './(auth)/Cart'; // Importando o Cart
import Profile from './(auth)/Profile'; // Importando o Profile
import { AuthProvider } from './context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // ou @react-native-vector-icons
import SearchResults from './(auth)/SearchResults';
import CategoriesWithProducts from './(auth)/CategoryProductsScreen';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Register2" component={Register2} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="SearchResults" component={SearchResults} />
      <Stack.Screen name="CategoryWithProducts" component={CategoriesWithProducts} />
    </Stack.Navigator>
  );
};


const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ headerShown: false }} />
      <Tab.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer independent={true}>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
