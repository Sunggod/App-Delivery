import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../../types'; // Atualize o caminho conforme necessário

// Defina interfaces para os dados
interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  stock?: number;
  imageURL?: string;
  isPromotionActive?: boolean;
  discountPercentage?: number;
  promotionStartDate?: string;
  promotionEndDate?: string;
  promotionDescription?: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  categoryImageUrl: string;
  products: Product[];
}

interface StoreInfo {
  logoURL: string;
}

// URL padrão da imagem
const defaultLogoURL = 'https://drive.google.com/uc?id=1YgjVjdMPxhUAXaw0xBa4pmHlGrl8M9ex';

const HeaderHome = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [storeLogo, setStoreLogo] = useState<string>(defaultLogoURL);
  const navigation = useNavigation<RootStackNavigationProp>();

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const response = await axios.get<StoreInfo>('http://192.168.1.2:3333/store-info');
        setStoreLogo(response.data.logoURL || defaultLogoURL);
      } catch (error) {
        console.error('Failed to fetch store info:', error);
        setStoreLogo(defaultLogoURL);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>('http://192.168.1.2:3333/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>('http://192.168.1.2:3333/products');
        setAllProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchStoreInfo();
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([]);
    } else {
      const filtered = allProducts.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ''
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, allProducts]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigation.navigate('SearchResults', { searchTerm, initialResults: filteredProducts });
    }
  };

  const handleCategoryPress = async (categoryId: string, categoryName: string) => {
    try {
      const response = await axios.get<Category[]>('http://192.168.1.2:3333/categories-with-products');
      console.log('Response from /categories-with-products:', response.data);

      // Encontre a categoria selecionada na resposta
      const selectedCategory = response.data.find((category) => category.id === categoryId);

      if (selectedCategory) {
        // Navegue para a tela 'CategoryWithProducts' com os dados da categoria e produtos
        navigation.navigate('CategoryWithProducts', { 
          categoryId, 
          categoryName, 
          products: selectedCategory.products 
        });
      } else {
        console.error('Categoria não encontrada');
      }
    } catch (error) {
      console.error('Falha ao buscar produtos para a categoria:', error);
    }
  };

  const renderSearchResultItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.searchResultItem}
      onPress={() => {
        setSearchTerm(item.name || '');
        handleSearch();
      }}
    >
      <Image source={{ uri: item.imageURL || defaultLogoURL }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.productPrice}>R$ {item.price?.toFixed(2) || '0.00'}</Text>
        {item.isPromotionActive && (
          <View style={styles.promotionInfo}>
            <Text style={styles.discount}>Desconto: {item.discountPercentage}%</Text>
            <Text style={styles.promotionDates}>
              De {item.promotionStartDate} até {item.promotionEndDate}
            </Text>
            <Text style={styles.promotionDescription}>{item.promotionDescription}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top row with Logo and Notification Icon */}
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Image source={{ uri: storeLogo }} style={styles.logo} />
        </View>
        <TouchableOpacity style={styles.notificationIcon}>
          <Icon name="bell" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Buscar produtos..."
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            onSubmitEditing={handleSearch}
          />
          <Icon name="magnify" size={24} color="gray" style={styles.searchIcon} />
        </View>
      </View>

      {/* Real-time search results */}
      {searchTerm.trim() !== '' && (
        <FlatList
          data={filteredProducts.slice(0, 5)} // Show only the first 5 results
          keyExtractor={(item) => item.id}
          renderItem={renderSearchResultItem}
          style={styles.searchResultsList}
        />
      )}

      {/* Categories Horizontal Scroll */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item.id, item.name)}
            >
              <Image source={{ uri: item.categoryImageUrl }} style={styles.categoryImage} />
              <Text style={styles.categoryName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the logo container horizontally
    alignItems: 'center',
    marginBottom: 40,
    marginTop:10,
  },
  logoContainer: {
    position: 'absolute', // Absolute positioning to center logo
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    height: 40,
    width: 96,
    resizeMode: 'contain',
  },
  notificationIcon: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  searchBarContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchResultsList: {
    maxHeight: 300,
    marginBottom: 16,
  },
    searchResultItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    productImage: {
      width: 50,
      height: 50,
      borderRadius: 4,
      marginRight: 12,
    },
    productInfo: {
      flex: 1,
    },
    productName: {
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 4,
    },
    productPrice: {
      fontSize: 14,
      color: '#2ecc71',
      fontWeight: '600',
    },
    promotionInfo: {
      marginTop: 8,
    },
    discount: {
      fontSize: 12,
      color: '#e74c3c',
    },
    promotionDates: {
      fontSize: 12,
      color: '#7f8c8d',
    },
    promotionDescription: {
      fontSize: 12,
      color: '#95a5a6',
    },
    categoriesContainer: {
      marginTop: 16,
    },
    categoryItem: {
      marginRight: 16,
      alignItems: 'center',
    },
    categoryImage: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    categoryName: {
      marginTop: 8,
      textAlign: 'center',
      fontSize: 12,
    },
  });
  
  export default HeaderHome;
  