import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define o tipo de Produto
export interface Product {
  id: string;
  name: string;
  imageURL?: string;  // Tornar opcional
  price?: number;     // Tornar opcional
  description?: string; // Adicionado
  stock?: number;      // Adicionado
  isPromotionActive?: boolean; // Adicionado
  discountPercentage?: number; // Adicionado
  promotionStartDate?: string;  // Adicionado
  promotionEndDate?: string;    // Adicionado
  promotionDescription?: string; // Adicionado
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  description?: string;
  categoryImageUrl?: string;
  products: Product[];
}

// Define os parâmetros para o stack de navegação principal
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Register2: { userId: string };
  Main: undefined;
  SearchResults: { searchTerm: string; initialResults: Product[] };
  CategoryWithProducts: { 
    categoryId: string; 
    categoryName: string;
    products: Product[]; // Adicione o tipo de produtos aqui
  };
};

// Define os parâmetros da navegação por abas
export type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
