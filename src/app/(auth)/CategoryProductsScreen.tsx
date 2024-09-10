import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Product } from '../../../types'; // Atualize o caminho conforme necessário
import { useAuth } from '../context/AuthContext'; // Atualize o caminho conforme necessário
import CardProductCategory from './../../components/CardProductCategory/index';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CategoryWithProductsRouteProp = RouteProp<RootStackParamList, 'CategoryWithProducts'>;

const CategoriesWithProducts: React.FC = () => {
  const route = useRoute<CategoryWithProductsRouteProp>();
  const { categoryName, products } = route.params;
  const { user } = useAuth(); // Obtém o usuário do contexto

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false); // Atualize conforme necessário se você estiver fazendo carregamento adicional
  }, []);

  const handleAddToCart = async (productId: string) => {
    console.log('productId recebido:', productId); // Verifique o valor
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado');
      console.error('Usuário não autenticado');
      return;
    }

    if (!productId) {
      Alert.alert('Erro', 'productId está faltando.');
      console.error('productId está faltando.');
      return;
    }

    try {
      // Verifica se o carrinho já existe
      console.log('Verificando carrinho para o usuário:', user.id);
      let response = await fetch(`http://192.168.1.2:3333/cart/${user.id}`);
      let cartData = await response.json();
      console.log('Dados do carrinho:', cartData);

      let cartId: string;

      if (response.ok && cartData.id) {
        cartId = cartData.id;
        console.log('Carrinho encontrado:', cartId);
      } else {
        console.log('Carrinho não encontrado, criando novo carrinho.');
        // Cria um novo carrinho se não existir
        response = await fetch('http://192.168.1.2:3333/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ customerId: user.id }),
        });
        cartData = await response.json();
        console.log('Dados do novo carrinho:', cartData);

        if (!response.ok) {
          throw new Error('Erro ao criar carrinho.');
        }
        cartId = cartData.id;
      }

      // Obtém os dados do produto
      console.log('Obtendo dados do produto com productId:', productId);
      const productResponse = await fetch(`http://192.168.1.2:3333/products/${productId}`);
      const productData = await productResponse.json();
      console.log('Dados do produto:', productData);

      if (!productResponse.ok) {
        throw new Error('Erro ao obter dados do produto.');
      }

      const totalPrice = productData.price * 1; // Calcula o preço total com base na quantidade (1 neste caso)
      console.log('Total Price calculado:', totalPrice);

      // Adiciona o produto ao carrinho
      console.log('Adicionando produto ao carrinho:', { customerId: user.id, productId, quantity: 1, totalPrice });
      response = await fetch('http://192.168.1.2:3333/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await AsyncStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ customerId: user.id, productId, quantity: 1, totalPrice }),
      });

      const result = await response.json();
      console.log('Resultado da adição ao carrinho:', result);

      if (response.ok) {
        console.log('Produto adicionado ao carrinho:', result);
        Alert.alert('Sucesso', 'Produto adicionado ao carrinho.');
      } else {
        console.error('Erro ao adicionar produto ao carrinho:', result.message);
        Alert.alert('Erro', result.message || 'Erro desconhecido ao adicionar produto ao carrinho.');
      }
    } catch (error) {
      console.error('Erro de rede:', error);
      Alert.alert('Erro de rede', 'Ocorreu um erro de rede. Tente novamente mais tarde.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderProductItem = ({ item }: { item: Product }) => (
    <CardProductCategory product={item} onAddToCart={handleAddToCart} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{categoryName}</Text>
      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  productList: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default CategoriesWithProducts;
