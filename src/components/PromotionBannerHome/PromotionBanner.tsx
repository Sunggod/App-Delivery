import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Image, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';

interface PromotionBanner {
  imageURL: string;
  order: number;
}

const screenWidth = Dimensions.get('window').width; // Largura da tela do dispositivo

const PromotionBanner = () => {
  const [banner, setBanner] = useState<PromotionBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionBanner = async () => {
      try {
        console.log('Fetching promotion banners...');
        const response = await axios.get<PromotionBanner[]>('http://192.168.1.2:3333/promotion-banner');
        const banners = response.data;
        console.log('Received promotion banners:', banners);
        const bannerWithOrder1 = banners.find(banner => banner.order === 1);
        console.log('Filtered banner with order 1:', bannerWithOrder1);
        setBanner(bannerWithOrder1 || null);
      } catch (error) {
        console.error('Failed to fetch promotion banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionBanner();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {banner ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: banner.imageURL }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => {
              console.error('Image loading error:', e.nativeEvent.error);
              setImageError('Failed to load image');
            }}
          />
          {imageError && <Text style={styles.errorText}>Error loading image: {imageError}</Text>}
        </View>
      ) : (
        <View style={styles.noBannerContainer}>
          <Text style={styles.noBannerText}>Nenhum banner de promoção disponível.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    width: '100%',
  },
  imageContainer: {
    height: 110, 
    width: '100%', 
    overflow: 'hidden',
    paddingHorizontal: 8, 
  },
  image: {
    height: '100%', 
    width: '100%', 
    borderRadius: 12,
  },
  noBannerContainer: {
    height: 192,
    width: '100%',
    backgroundColor: '#e5e5e5',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8, 
  },
  noBannerText: {
    color: '#6b6b6b',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});


export default PromotionBanner;
