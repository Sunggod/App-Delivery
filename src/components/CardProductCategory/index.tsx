import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../../../types'; // Certifique-se de importar o tipo correto

interface CardProductCategoryProps {
  product: Product;
  onAddToCart: (productId: string) => void;
}

const CardProductCategory: React.FC<CardProductCategoryProps> = ({ product, onAddToCart }) => {
  return (
    <TouchableOpacity style={styles.productItem} onPress={() => onAddToCart(product.id)}>
      <Image source={{ uri: product.imageURL || 'https://via.placeholder.com/150' }} style={styles.productImage} resizeMode="contain" />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>R$ {product.price?.toFixed(2) || '0.00'}</Text>
        {product.isPromotionActive && (
          <View style={styles.promotionInfo}>
            <Text style={styles.discount}>Desconto: {product.discountPercentage}%</Text>
            <Text style={styles.promotionDates}>
              De {product.promotionStartDate} até {product.promotionEndDate}
            </Text>
            <Text style={styles.promotionDescription}>{product.promotionDescription}</Text>
          </View>
        )}
        {product.stock !== undefined && (
          <Text style={styles.stock}>Estoque: {product.stock}</Text>
        )}
        {product.description && (
          <Text style={styles.description}>{product.description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    elevation: 2,
    padding: 8,
    justifyContent: 'space-between',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  productInfo: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '600',
  },
  promotionInfo: {
    marginTop: 8,
    paddingHorizontal: 4,
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
  stock: {
    fontSize: 12,
    color: '#34495e',
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: '#2c3e50',
    marginTop: 4,
  },
});

export default CardProductCategory;
